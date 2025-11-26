#!/usr/bin/env node

/**
 * MCP Server for Kynhood Events API
 *
 * This server provides tools for Claude Desktop to interact with the Kynhood Events API:
 * - listEvents: List events with pagination
 * - getEventById: Get detailed event information
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

import { logger } from './utils/logger.js';
import {
  listEventsTool,
  listEventsToolDefinition,
  ListEventsInput
} from './tools/listEvents.js';
import {
  getEventByIdTool,
  getEventByIdToolDefinition,
  GetEventByIdInput
} from './tools/getEventById.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const API_BASE_URL = process.env.API_BASE_URL;
logger.info('Starting MCP Kynhood Events Server', { API_BASE_URL });

// Create MCP server instance
const server = new Server(
  {
    name: 'mcp-kynhood-events',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Define available tools
const tools: Tool[] = [
  listEventsToolDefinition as Tool,
  getEventByIdToolDefinition as Tool
];

// Handle ListTools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.debug('ListTools request received');
  return {
    tools
  };
});

// Handle CallTool request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  logger.info(`Tool called: ${name}`, args);

  try {
    switch (name) {
      case 'listEvents': {
        const input = args as ListEventsInput;
        const result = await listEventsTool(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'getEventById': {
        const input = args as GetEventByIdInput;
        const result = await getEventByIdTool(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logger.error(`Tool execution failed: ${name}`, error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: errorMessage,
            tool: name
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Start server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info('MCP Kynhood Events Server running on stdio');
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

main();
