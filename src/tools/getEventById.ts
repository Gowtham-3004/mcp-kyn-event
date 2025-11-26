/**
 * MCP Tool: Get Event by ID
 */

import { getEventById } from '../api/events.js';
import { logger } from '../utils/logger.js';

export interface GetEventByIdInput {
  id: string;
}

export interface GetEventByIdOutput {
  event: any;
}

/**
 * Get detailed information about a specific event
 */
export async function getEventByIdTool(input: GetEventByIdInput): Promise<GetEventByIdOutput> {
  const { id } = input;

  logger.debug('getEventById tool called', { id });

  if (!id) {
    throw new Error('Event ID is required');
  }

  try {
    const event = await getEventById(id);

    return {
      event
    };
  } catch (error) {
    logger.error('getEventById tool error', error);
    throw error;
  }
}

export const getEventByIdToolDefinition = {
  name: 'getEventById',
  description: 'Get detailed information about a specific event by its ID. Returns complete event details including description, location, date, and other metadata.',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The unique identifier of the event (24-character hex string)'
      }
    },
    required: ['id']
  }
};
