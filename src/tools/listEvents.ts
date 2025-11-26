/**
 * MCP Tool: List Events
 */

import { getEvents } from '../api/events.js';
import { logger } from '../utils/logger.js';

export interface ListEventsInput {
  skip?: number;
  limit?: number;
}

export interface ListEventsOutput {
  events: any[];
  count: number;
  skip: number;
  limit: number;
}

const DEFAULT_SKIP = parseInt(process.env.DEFAULT_SKIP || '0', 10);
const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_LIMIT || '10', 10);

/**
 * List events with optional pagination
 */
export async function listEventsTool(input: ListEventsInput): Promise<ListEventsOutput> {
  const skip = input.skip ?? DEFAULT_SKIP;
  const limit = input.limit ?? DEFAULT_LIMIT;

  logger.debug('listEvents tool called', { skip, limit });

  try {
    const events = await getEvents(skip, limit);

    return {
      events,
      count: events.length,
      skip,
      limit
    };
  } catch (error) {
    logger.error('listEvents tool error', error);
    throw error;
  }
}

export const listEventsToolDefinition = {
  name: 'listEvents',
  description: 'List events from Kynhood API with optional pagination. Returns a list of trending and upcoming events.',
  inputSchema: {
    type: 'object',
    properties: {
      skip: {
        type: 'number',
        description: 'Number of events to skip (for pagination)',
        default: DEFAULT_SKIP
      },
      limit: {
        type: 'number',
        description: 'Maximum number of events to return',
        default: DEFAULT_LIMIT
      }
    }
  }
};
