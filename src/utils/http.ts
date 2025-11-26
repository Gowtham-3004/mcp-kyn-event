/**
 * HTTP wrapper with automatic token management and retry logic
 */

import fetch from 'node-fetch';
import { logger } from './logger.js';
import { tokenCache } from './tokenCache.js';
import { fetchGuestToken } from '../api/token.js';

const API_BASE_URL = process.env.API_BASE_URL;

interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  requiresAuth?: boolean;
  isRetry?: boolean;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseBody?: any
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Make HTTP request with automatic token attachment and 401 retry
 */
export async function httpRequest<T = any>(
  endpoint: string,
  options: HttpOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    requiresAuth = true,
    isRetry = false
  } = options;

  // Build full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Attach token if required
  if (requiresAuth) {
    let token = tokenCache.getToken();

    // Fetch token if not cached
    if (!token) {
      logger.debug('No cached token, fetching new token');
      token = await fetchGuestToken();
    }

    headers['Authorization'] = `Bearer ${token}`;
  }

  logger.debug(`HTTP ${method} ${url}`, { headers: { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : undefined } });

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    const responseText = await response.text();
    let responseData: any;

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      // Handle 401 Unauthorized - retry once with new token
      if (response.status === 401 && requiresAuth && !isRetry) {
        logger.warn('Received 401, clearing token cache and retrying');
        tokenCache.clearToken();

        // Retry with new token
        return httpRequest<T>(endpoint, { ...options, isRetry: true });
      }

      throw new HttpError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData
      );
    }

    logger.debug(`HTTP ${method} ${url} - Success`, responseData);
    return responseData as T;

  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    logger.error(`HTTP request failed: ${method} ${url}`, error);
    throw new HttpError(
      `Request failed: ${error instanceof Error ? error.message : String(error)}`,
      undefined,
      error
    );
  }
}
