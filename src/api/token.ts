/**
 * Token API - Fetch guest token from Kynhood
 */

import { httpRequest } from '../utils/http.js';
import { logger } from '../utils/logger.js';
import { tokenCache } from '../utils/tokenCache.js';

interface TokenResponse {
  token: string;
  userId: string;
  type: string;
  message: string;
}

/**
 * Fetch guest token from Kynhood API
 * Caches token for reuse
 */
export async function fetchGuestToken(): Promise<string> {
  try {
    logger.info('Fetching guest token from Kynhood API');

    const response = await httpRequest<TokenResponse>('/token', {
      method: 'GET',
      requiresAuth: false
    });

    if (!response.token) {
      throw new Error('Token not found in response');
    }

    logger.info('Guest token obtained successfully', {
      userId: response.userId,
      type: response.type
    });

    // Cache token (default TTL: 55 minutes)
    tokenCache.setToken(response.token);

    return response.token;

  } catch (error) {
    logger.error('Failed to fetch guest token', error);
    throw new Error(`Failed to obtain guest token: ${error instanceof Error ? error.message : String(error)}`);
  }
}
