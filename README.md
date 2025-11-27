# MCP Kynhood Events Server

A Model Context Protocol (MCP) server that enables Claude Desktop to interact with the Kynhood Events API. This server provides tools for listing events and retrieving detailed event information.

## Features

- **Automatic Token Management**: Fetches and caches guest tokens automatically
- **Smart Retry Logic**: Handles 401 errors by refreshing tokens
- **Type-Safe**: Built with TypeScript for robust error handling
- **Production-Ready**: Comprehensive logging and error handling

## Tools Available

### 1. `listEvents`
List events from the Kynhood API with pagination support.

**Parameters:**
- `skip` (optional, default: 0): Number of events to skip
- `limit` (optional, default: 10): Maximum number of events to return

**Returns:** Array of events with metadata

### 2. `getEventById`
Get detailed information about a specific event.

**Parameters:**
- `id` (required): The event ID (24-character hex string)

**Returns:** Complete event details

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Claude Desktop app

### Steps

1. **Clone or create the project directory:**
```bash
mkdir mcp-kynhood-events
cd mcp-kynhood-events
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment (optional):**
```bash
cp .env.example .env
```

Edit `.env` if you need to customize settings:
```env
API_BASE_URL=https://***.****.com/api
DEFAULT_SKIP=0
DEFAULT_LIMIT=10
DEBUG=false
```

## Running the Server

### Development Mode
```bash
npm start
```

### Build TypeScript
```bash
npm run build
```

### Watch Mode (Auto-restart)
```bash
npm run dev
```

## Connecting to Claude Desktop

### Configuration

Add this server to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "kynhood-events": {
      "command": "node",
      "args": [
        "G:\\projects\\mcp\\event\\dist\\index.js"
      ],
      "env": {
        "API_BASE_URL": "https://***.****.com/api"
      }
    }
  }
}
```

**Alternative: Using TypeScript directly (no build required):**
```json
{
  "mcpServers": {
    "kynhood-events": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "G:\\projects\\mcp\\event\\src\\index.ts"
      ],
      "env": {
        "API_BASE_URL": "https://***.****.com/api"
      }
    }
  }
}
```

**Note**: Update the path to match your actual installation directory.

### Restart Claude Desktop

After updating the configuration, completely quit and restart Claude Desktop for changes to take effect.

## Usage Examples

Once connected to Claude Desktop, you can use natural language to interact with the Kynhood Events API:

### Example Queries

**List trending events:**
```
Show me the latest events from Kynhood
```

**Get specific event details:**
```
Get details for event 68cd87381ea5
```

**List with pagination:**
```
Show me events 10-20 from Kynhood (skip 10, limit 10)
```

**Multiple operations:**
```
List the first 5 events, then show me details for the first one
```

## Architecture

### Project Structure
```
mcp-kynhood-events/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── api/
│   │   ├── token.ts          # Token fetching logic
│   │   └── events.ts         # Events API calls
│   ├── tools/
│   │   ├── listEvents.ts     # List events tool
│   │   └── getEventById.ts   # Get event by ID tool
│   └── utils/
│       ├── http.ts           # HTTP client with retry logic
│       ├── logger.ts         # Logging utility
│       └── tokenCache.ts     # In-memory token cache
├── package.json
├── tsconfig.json
└── README.md
```

### Token Management Flow

1. **First Request**: Server checks token cache (empty)
2. **Fetch Token**: Calls `GET /api/token` to get guest token
3. **Cache Token**: Stores token with 55-minute TTL
4. **Use Token**: Attaches to all subsequent API requests
5. **Handle 401**: If token expires, automatically fetches new token and retries

### Error Handling

- **Network Errors**: Logged and returned to Claude with context
- **401 Unauthorized**: Automatically retries once with fresh token
- **Invalid Responses**: Validates response structure and provides meaningful errors
- **Missing Parameters**: Validates required parameters before API calls

## API Endpoints Used

### 1. Get Guest Token
```
GET https://***.****.com/api/token
```
Returns JWT token for guest authentication.

### 2. List Events
```
POST https://***.****.com/api/events?skip=0&limit=10
Authorization: Bearer <token>
Body: {}
```
Returns paginated list of events.

### 3. Get Event by ID
```
GET https://***.****.com/api/events/:eventId
Authorization: Bearer <token>
```
Returns detailed event information.

## Development

### Adding New Tools

1. Create tool file in `src/tools/`
2. Define input/output interfaces
3. Implement tool function
4. Export tool definition
5. Register in `src/index.ts`

### Debugging

Enable debug logging:
```env
DEBUG=true
```

Logs are output to stderr (visible in Claude Desktop logs).

## Troubleshooting

### Server Not Appearing in Claude Desktop

1. Check configuration file path is correct
2. Verify JSON syntax in `claude_desktop_config.json`
3. Ensure file paths use absolute paths
4. Restart Claude Desktop completely

### Token Errors

- Server automatically handles token refresh
- Check API_BASE_URL is correct
- Verify network connectivity to api.kynhood.com

### Build Errors

```bash
# Clean and reinstall
rm -rf node_modules dist
npm install
npm run build
```

## Testing the API Manually

You can test the Kynhood API endpoints directly:

```bash
# Get token
curl https://***.****.com/api/token

# List events (replace TOKEN with actual token)
curl -X POST "https://***.****.com/api/events?skip=0&limit=10" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d "{}"

# Get event by ID
curl "https://***.****.com/api/events/68cd8a9496a5" \
  -H "Authorization: Bearer TOKEN"
```

## License

MIT

## Support

For issues or questions:
- Check the logs in Claude Desktop
- Verify API connectivity: `curl https://***.****.com/api/token`
- Review this README for configuration steps
