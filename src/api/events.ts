/**
 * Events API - List and retrieve event details
 */

import { httpRequest } from '../utils/http.js';
import { logger } from '../utils/logger.js';

interface EventsResponse {
  data: any[];
  message: string;
}

interface EventResponse {
  data: any;
  message: string;
}

/**
 * Get list of events with pagination
 */
export async function getEvents(skip: number = 0, limit: number = 10): Promise<any[]> {
  try {
    logger.info(`Fetching events (skip: ${skip}, limit: ${limit})`);

    const response = await httpRequest<EventsResponse>(
      `/events?skip=${skip}&limit=${limit}`,
      {
        method: 'GET',
        requiresAuth: true
      }
    );

    if (!response.data || !Array.isArray(response.data)) {
      logger.warn('Unexpected response format for events list', response);
      return [];
    }

    logger.info(`Retrieved ${response.data.length} events`);
    return response.data;

  } catch (error) {
    logger.error('Failed to fetch events', error);
    throw new Error(`Failed to fetch events: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get event details by ID
 */
export async function getEventById(eventId: string): Promise<any> {
  try {
    if (!eventId || typeof eventId !== 'string') {
      throw new Error('Valid event ID is required');
    }

    logger.info(`Fetching event details for ID: ${eventId}`);

    const response = await httpRequest<EventResponse>(
      `/events/${eventId}`,
      {
        method: 'GET',
        requiresAuth: true
      }
    );

    if (!response.data) {
      throw new Error('Event data not found in response');
    }

    logger.info(`Retrieved event details for ID: ${eventId}`);
    return response.data;

  } catch (error) {
    logger.error(`Failed to fetch event ${eventId}`, error);
    throw new Error(`Failed to fetch event details: ${error instanceof Error ? error.message : String(error)}`);
  }
}
