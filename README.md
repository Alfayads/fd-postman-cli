# fd-postman-cli

A powerful and efficient command-line interface (CLI) tool designed for developers, DevOps engineers, and anyone who needs to interact with and test APIs directly from their terminal. Inspired by the popular GUI tool Postman, fd-postman-cli brings robust API testing capabilities into a lightweight, scriptable, and terminal-native environment.

<div align="center">
  
  ![fd-postman-cli Demo](https://raw.githubusercontent.com/Alfayads/fd-postman-cli/main/assets/demo.gif)
  
  *Beautiful, animated CLI experience with powerful API testing capabilities*
  
</div>

## Features

- 🚀 **Fast and Lightweight**: Built with performance in mind
- 🎨 **Beautiful Output**: Colored and formatted responses for better readability
- 📝 **Multiple HTTP Methods**: Support for GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- 🔧 **Flexible Headers**: Easy header management
- 📊 **Query Parameters**: Simple query parameter handling
- 📤 **Form Data**: Support for form data submissions
- 💾 **Save Responses**: Save API responses to files
- 📄 **JSON Support**: Automatic JSON parsing and pretty-printing
- 🔐 **File Support**: Load request body from files
- 🔑 **Authentication**: Bearer Token, Basic Auth, API Key
- 🌍 **Multi-scope Variables**: Global, Environment, Collection, and Local variables
- 📦 **Collections**: Group and organize related requests
- 🔄 **Workflows**: Chain requests with variable extraction
- 📜 **History**: Track and replay previous requests
- 🧪 **Test Assertions**: Validate responses automatically
- 📥📤 **Import/Export**: Backup and share collections and environments
- ✨ **Animated CLI**: Beautiful terminal experience
- 🎨 **Autocomplete**: Smart suggestions with emoji icons (Bash/Zsh/Fish)

## Installation

### From npm (when published)

```bash
npm install -g fd-postman-cli
```

### From source

```bash
# Clone the repository
git clone <repository-url>
cd fd-postman-cli

# Install dependencies
npm install

# Build the project
npm run build

# Link globally for local development
npm link
```

### 🎨 Enable Autocomplete (Optional but Recommended!)

Get beautiful emoji-enhanced autocomplete suggestions as you type:

```bash
# Run the installation script
cd completions
./install-completions.sh

# Reload your shell
source ~/.bashrc  # for Bash
# or
source ~/.zshrc   # for Zsh
```

**Features:**
- 🎯 Smart context-aware suggestions
- 🎨 Visual emoji icons for every command
- 📝 Helpful descriptions
- ⚡ Works with Bash, Zsh, and Fish

See [Autocomplete Guide](docs/AUTOCOMPLETE.md) for detailed instructions.

## Usage

The CLI tool uses the command `fp` (fd-postman).

### Basic Syntax

```bash
# HTTP Methods
fp <method> <url> [options]

# Environment Management
fp env <subcommand> [options]

# Collection Management
fp collection <subcommand> [options]

# History Management
fp history <subcommand> [options]
```

### Main Commands

- **HTTP Methods**: `get`, `post`, `put`, `delete`, `patch`, `head`, `options`
- **Environment**: Manage environment variables
- **Collection**: Manage request collections
- **Global**: Manage global variables
- **History**: View request history

### GET Request

```bash
# Simple GET request
fp get https://api.example.com/users

# GET with query parameters
fp get https://api.example.com/users -q "page=1" "limit=10"

# GET with custom headers
fp get https://api.example.com/users -H "Authorization: Bearer token123"

# Save response to file
fp get https://api.example.com/users -o response.json
```

### POST Request

```bash
# POST with JSON data
fp post https://api.example.com/users -d '{"name":"John","email":"john@example.com"}'

# POST with data from file
fp post https://api.example.com/users -d @data.json

# POST with form data
fp post https://api.example.com/users -f "name=John" "email=john@example.com"

# POST with headers
fp post https://api.example.com/users -H "Content-Type: application/json" -d '{"name":"John"}'
```

### PUT Request

```bash
# PUT with JSON data
fp put https://api.example.com/users/1 -d '{"name":"John Updated"}'

# PUT with data from file
fp put https://api.example.com/users/1 -d @update.json
```

### DELETE Request

```bash
# Simple DELETE request
fp delete https://api.example.com/users/1

# DELETE with headers
fp delete https://api.example.com/users/1 -H "Authorization: Bearer token123"
```

### PATCH Request

```bash
# PATCH with JSON data
fp patch https://api.example.com/users/1 -d '{"name":"Partially Updated"}'
```

### Environment Management

```bash
# Create or update environment
fp env set production \
  baseUrl=https://api.production.com \
  token=abc123xyz \
  userId=42

# List all environments
fp env list

# Show environment variables
fp env show production

# Set active environment (used for all requests)
fp env use production

# Show currently active environment
fp env active

# Clear active environment
fp env unuse

# Remove variables from environment
fp env unset production token

# Delete environment
fp env delete production
```

### Global Variables

Global variables are available to all requests and have the lowest precedence in variable resolution.

```bash
# Set global variables
fp global set \
  defaultTimeout=30000 \
  userAgent="fd-postman-cli/1.0.0"

# List global variables
fp global list

# Remove global variables
fp global unset defaultTimeout

# Clear all global variables
fp global clear
```

### Collection Management

```bash
# Create a collection
fp collection create "My API Tests" -d "Collection for API testing"

# List all collections
fp collection list

# Show collection details
fp collection show "My API Tests"

# Run all requests in a collection
fp collection run "My API Tests"

# Run collection with specific environment
fp collection run "My API Tests" --env production

# Delete a collection
fp collection delete "My API Tests"
```

### History Management

```bash
# List recent requests
fp history list --limit 10

# Show detailed history entry
fp history show <entry-id>

# Search history
fp history search "users"

# Clear all history
fp history clear
```

## Options

### Global Options

- `-v, --version`: Display the current version
- `-h, --help`: Show help information

### Request Options

- `-H, --header <headers...>`: Add custom headers (format: `"Key: Value"` or `"Key=Value"`)
- `-q, --query <params...>`: Add query parameters (format: `"key=value"`)
- `-d, --data <data>`: Request body data (JSON string or `@filepath`)
- `-f, --form <fields...>`: Form data fields (format: `"key=value"`)
- `-o, --output <file>`: Save response body to file
- `--timeout <ms>`: Request timeout in milliseconds (default: 30000)
- `--env <name>`: Use environment variables

### Response Handling Options

- `--pretty`: Pretty print JSON response (default: true)
- `--raw`: Show raw response without formatting
- `--filter <path>`: Extract specific data using JSON path (e.g., `data.user.name`, `items[0]`)
- `--save-headers <file>`: Save response headers to file
- `--save-body <file>`: Save response body to file
- `--verbose`: Show detailed request/response information

### Authentication Options

- `--auth-type <type>`: Authentication type (`bearer`, `basic`, `apikey`)
- `--token <token>`: Bearer token for OAuth 2.0
- `--username <user>`: Username for basic authentication
- `--password <pass>`: Password for basic authentication
- `--api-key <key>`: API key value
- `--api-key-name <name>`: API key header/query parameter name (default: `X-API-Key`)
- `--api-key-in <location>`: API key location - `header` or `query` (default: `header`)

### SSL/TLS Options

- `--insecure`: Skip SSL certificate validation (useful for self-signed certificates)
- `--no-follow-redirects`: Do not follow HTTP redirects automatically
- `--max-redirects <number>`: Maximum number of redirects to follow (default: 5)

## Examples

### API Testing Workflow

```bash
# 1. Get all users
fp get https://api.example.com/users

# 2. Create a new user
fp post https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","role":"admin"}'

# 3. Get specific user
fp get https://api.example.com/users/123

# 4. Update user
fp put https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Updated","role":"super-admin"}'

# 5. Partial update
fp patch https://api.example.com/users/123 \
  -d '{"status":"active"}'

# 6. Delete user
fp delete https://api.example.com/users/123 \
  -H "Authorization: Bearer token123"
```

### Working with Authentication

#### Bearer Token (OAuth 2.0)

```bash
# Using --auth-type bearer
fp get https://api.example.com/protected \
  --auth-type bearer \
  --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Or manually with header
fp get https://api.example.com/protected \
  -H "Authorization: Bearer eyJhbGc..."
```

#### Basic Authentication

```bash
# Using --auth-type basic
fp get https://api.example.com/protected \
  --auth-type basic \
  --username myusername \
  --password mypassword

# Or manually with header
fp get https://api.example.com/protected \
  -H "Authorization: Basic dXNlcjpwYXNz"
```

#### API Key Authentication

```bash
# API key in header (default)
fp get https://api.example.com/data \
  --auth-type apikey \
  --api-key your-api-key-here \
  --api-key-name X-API-Key

# API key in query parameter
fp get https://api.example.com/data \
  --auth-type apikey \
  --api-key your-api-key-here \
  --api-key-name api_key \
  --api-key-in query

# Or manually with header
fp get https://api.example.com/data \
  -H "X-API-Key: your-api-key-here"

# Or manually with query param
fp get https://api.example.com/data \
  -q "api_key=your-api-key-here"
```

#### With Environment Variables

```bash
# Store authentication in environment
fp env set production \
  token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... \
  apiKey=your-api-key

# Use with requests (specify environment)
fp get https://api.example.com/protected \
  --env production \
  --auth-type bearer \
  --token {{token}}

# Or set active environment (no need for --env flag)
fp env use production

# Now all requests use production environment
fp get https://api.example.com/protected \
  --auth-type bearer \
  --token {{token}}
```

### Variable Scopes & Precedence

fd-postman-cli supports multiple variable scopes with the following precedence (highest to lowest):

1. **Local Variables** (request-specific) - Highest priority
2. **Collection Variables** (collection-level)
3. **Environment Variables** (environment-level)
4. **Global Variables** (application-level) - Lowest priority

```bash
# Set global variables (available everywhere)
fp global set apiDomain=api.example.com

# Set environment variables (for specific context)
fp env set production \
  apiDomain=api.production.com \
  token=prod-token-123

fp env set staging \
  apiDomain=api.staging.com \
  token=staging-token-456

# Use variables in requests
fp get https://{{apiDomain}}/users --env production
# Uses: api.production.com (environment overrides global)

fp get https://{{apiDomain}}/users --env staging
# Uses: api.staging.com

fp get https://{{apiDomain}}/users
# Uses: api.example.com (global, no environment active)
```

### Complex Requests

```bash
# Multiple headers and query parameters
fp get https://api.example.com/search \
  -H "Authorization: Bearer token" \
  -H "Accept: application/json" \
  -q "q=search term" \
  -q "page=1" \
  -q "limit=20"

# POST with file and save response
fp post https://api.example.com/upload \
  -H "Content-Type: application/json" \
  -d @request-data.json \
  -o response-output.json

# GET with timeout and SSL bypass
fp get https://self-signed-ssl-site.com/api \
  --timeout 5000 \
  --insecure

# Request with all options
fp post https://api.example.com/data \
  --env production \
  --auth-type bearer \
  --token {{apiToken}} \
  --timeout 10000 \
  --insecure \
  --max-redirects 10 \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}' \
  -o response.json
```

### Additional HTTP Methods

```bash
# HEAD - Get response headers only
fp head https://api.example.com/health

# OPTIONS - Get supported HTTP methods
fp options https://api.example.com/users
```

### Response Handling & Filtering

```bash
# View raw response (no formatting)
fp get https://api.example.com/data --raw

# Filter JSON response using path syntax
fp get https://jsonplaceholder.typicode.com/users/1 --filter name
fp get https://jsonplaceholder.typicode.com/users/1 --filter address.city
fp get https://jsonplaceholder.typicode.com/posts --filter '[0].title'

# Save response body
fp get https://api.example.com/data -o response.json

# Save response headers
fp get https://api.example.com/data --save-headers headers.txt

# Save both body and headers
fp get https://api.example.com/data \
  --save-body body.json \
  --save-headers headers.txt

# Extract and save specific field
fp get https://api.example.com/user --filter email -o user-email.txt
```

### Testing & Assertions

The built-in test runner supports various assertion types:

```bash
# Status code validation
# Test: response.status === 200

# Header validation  
# Test: response.headers['content-type'] === 'application/json'

# Body content validation
# Test: response.data.id === 1
# Test: response.data.user.name === 'John Doe'

# Tests are executed automatically when defined in collections
# Test results show pass/fail with expected vs actual values
```

## Request Chaining & Workflows

Execute a sequence of requests with variable capture and passing data between steps.

### Create a Workflow

```bash
# Create a workflow template
fp workflow create "User Registration Flow"
# Creates: user-registration-flow.workflow.json

# Or specify custom output file
fp workflow create "API Test Flow" -o my-workflow.json
```

### Workflow File Structure

```json
{
  "name": "User Authentication Flow",
  "description": "Login and fetch user profile",
  "environment": "development",
  "steps": [
    {
      "name": "Step 1: Login",
      "request": {
        "method": "POST",
        "url": "https://api.example.com/auth/login",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "email": "user@example.com",
          "password": "password123"
        }
      },
      "extractVariables": [
        {
          "name": "authToken",
          "path": "token",
          "scope": "workflow"
        },
        {
          "name": "userId",
          "path": "user.id",
          "scope": "workflow"
        }
      ],
      "continueOnError": false
    },
    {
      "name": "Step 2: Get User Profile",
      "request": {
        "method": "GET",
        "url": "https://api.example.com/users/{{userId}}",
        "headers": {
          "Authorization": "Bearer {{authToken}}"
        }
      },
      "extractVariables": [
        {
          "name": "userEmail",
          "path": "email",
          "scope": "environment"
        }
      ],
      "continueOnError": false
    }
  ]
}
```

### Execute a Workflow

```bash
# Run a workflow
fp workflow run user-flow.workflow.json

# Run with specific environment
fp workflow run user-flow.workflow.json --env production

# Verbose output
fp workflow run user-flow.workflow.json --verbose
```

### Variable Scopes in Workflows

- **`workflow`**: Available only within the current workflow execution
- **`environment`**: Saved to the active environment
- **`global`**: Saved to global variables

### Variable Extraction

Extract data from responses using JSON path syntax:

```json
{
  "extractVariables": [
    {
      "name": "token",
      "path": "data.token",
      "scope": "workflow"
    },
    {
      "name": "firstUserId",
      "path": "users[0].id",
      "scope": "environment"
    }
  ]
}
```

## Import & Export

Easily backup, share, and migrate collections and environments.

### Export Commands

```bash
# Export a specific collection
fp export collection "My API Tests"
# Creates: my-api-tests.collection.json

# Export with custom filename
fp export collection "My API Tests" -o backup.json

# Export a specific environment
fp export env "Production"
# Creates: production.env.json

# Export with custom filename
fp export env "Production" -o prod-env.json

# Export everything (all collections and environments)
fp export all
# Creates: ./fd-postman-exports/
#   ├── collections/
#   │   ├── collection1.collection.json
#   │   └── collection2.collection.json
#   └── environments/
#       ├── dev.env.json
#       └── prod.env.json

# Export all to custom directory
fp export all -d ~/my-backups
```

### Import Commands

```bash
# Import a collection
fp import collection my-api-tests.collection.json

# Import and merge with existing collection (if name matches)
fp import collection my-api-tests.collection.json --merge

# Import an environment
fp import env production.env.json

# Import and merge with existing environment
fp import env production.env.json --merge
```

### Use Cases

**Backup Before Changes:**
```bash
fp export all -d ./backup-$(date +%Y%m%d)
```

**Share with Team:**
```bash
fp export collection "Project API Tests" -o shared-tests.json
# Share shared-tests.json with your team
```

**Migrate Between Machines:**
```bash
# On machine 1
fp export all -d ~/fd-exports

# On machine 2  
fp import collection ~/fd-exports/collections/*.collection.json
fp import env ~/fd-exports/environments/*.env.json
```

## History & Replay

View and replay past requests.

### View History

```bash
# List recent requests (last 10)
fp history list

# List more entries
fp history list --limit 50

# Show detailed history entry
fp history show <id>

# Search history
fp history search "api.example.com"
fp history search "POST"
```

### Replay Requests

```bash
# Replay a request from history
fp history replay <id>

# Alias
fp history rerun <id>
```

### Example Workflow

```bash
# 1. Make a request
fp get https://api.example.com/users

# 2. List history to find the ID
fp history list
# Output shows:
#   1. 2024-01-15 10:30:25
#      GET https://api.example.com/users
#      Status: 200 • Duration: 145ms
#      ID: 1705315825000-abc123

# 3. Replay that exact request
fp history replay 1705315825000-abc123

# 4. Search for specific requests
fp history search "users"

# 5. Clear old history
fp history clear
```

### History Storage

- All requests are automatically logged
- History includes full request and response details
- Stored locally in `~/.fd-postman-cli/history/`
- Can be cleared anytime with `fp history clear`

## Development

### Project Structure

```
fd-postman-cli/
├── src/
│   ├── cli.ts              # CLI entry point with command definitions
│   ├── index.ts            # Main library exports
│   ├── core/
│   │   └── request.ts      # HTTP request handler
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   └── utils/
│       ├── parser.ts       # Argument parsing utilities
│       └── formatter.ts    # Response formatting utilities
├── dist/                   # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.json
├── .prettierrc.json
└── README.md
```

### Available Scripts

```bash
# Build the project
npm run build

# Watch mode for development
npm run dev

# Run the CLI locally
npm start -- get https://api.example.com

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Code Quality

The project uses:
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Jest** for testing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Author

Your Name

## Support

For issues and questions, please open an issue on GitHub.

