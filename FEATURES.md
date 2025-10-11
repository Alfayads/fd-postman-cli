# fd-postman-cli - Complete Feature List

## 🌐 HTTP Methods (7 total)

| Method  | Description | Status |
|---------|-------------|--------|
| GET     | Retrieve resources | ✅ |
| POST    | Create resources | ✅ |
| PUT     | Update resources (full replacement) | ✅ |
| DELETE  | Remove resources | ✅ |
| PATCH   | Partial update | ✅ |
| HEAD    | Get headers only | ✅ |
| OPTIONS | Discover supported methods | ✅ |

## 🔐 Authentication Methods (4 types)

### 1. No Auth (Default)
```bash
fp get https://api.example.com/public
```

### 2. Bearer Token (OAuth 2.0)
```bash
fp get https://api.example.com/protected \
  --auth-type bearer \
  --token eyJhbGciOiJIUzI1NiIs...
```

### 3. Basic Authentication
```bash
fp get https://api.example.com/protected \
  --auth-type basic \
  --username myuser \
  --password mypass
```

### 4. API Key
```bash
# In Header (default)
fp get https://api.example.com/data \
  --auth-type apikey \
  --api-key your-key \
  --api-key-name X-API-Key

# In Query Parameter
fp get https://api.example.com/data \
  --auth-type apikey \
  --api-key your-key \
  --api-key-in query
```

## 📄 Request Body Types

| Type | CLI Option | Example |
|------|------------|---------|
| JSON (raw) | `-d` | `-d '{"key":"value"}'` |
| JSON (file) | `-d @file` | `-d @data.json` |
| Form Data | `-f` | `-f "key=value"` |
| Raw Text | `-d` | `-d "plain text"` |
| XML | `-d` | `-d '<xml>...</xml>' -H "Content-Type: application/xml"` |

## 🔒 SSL/TLS Control

| Feature | Flag | Default | Description |
|---------|------|---------|-------------|
| Certificate Validation | (none) | Enabled | Secure by default |
| Skip SSL Validation | `--insecure` | Disabled | For self-signed certs |
| Follow Redirects | `--no-follow-redirects` | Enabled | Control redirects |
| Max Redirects | `--max-redirects <n>` | 5 | Limit redirect chains |

## ⚙️ Request Configuration

| Option | Flag | Default | Description |
|--------|------|---------|-------------|
| Timeout | `--timeout <ms>` | 30000 | Request timeout |
| Custom Headers | `-H "Key: Value"` | None | Multiple supported |
| Query Parameters | `-q "key=value"` | None | Multiple supported |
| Environment | `--env <name>` | Active env | Override active |
| Output File | `-o <file>` | Console | Save response |
| Pretty Print | `--pretty` | true | JSON formatting |

## 🌍 Environment Management

| Command | Description |
|---------|-------------|
| `fp env set <name> <vars...>` | Create/update environment |
| `fp env list` | List all environments |
| `fp env show <name>` | Show environment details |
| `fp env use <name>` | Set active environment |
| `fp env active` | Show active environment |
| `fp env unuse` | Clear active environment |
| `fp env unset <name> <keys...>` | Remove variables |
| `fp env delete <name>` | Delete environment |

## 🌐 Global Variables

| Command | Description |
|---------|-------------|
| `fp global set <key=value...>` | Set global variables |
| `fp global list` | List all globals |
| `fp global unset <keys...>` | Remove variables |
| `fp global clear` | Clear all globals |

## 📂 Collection Management

| Command | Description |
|---------|-------------|
| `fp collection create <name>` | Create collection |
| `fp collection list` | List all collections |
| `fp collection show <name>` | Show collection details |
| `fp collection run <name>` | Run all requests in collection |
| `fp collection delete <name>` | Delete collection |

### Collection-Level Settings

Collections support default settings applied to all requests:

- **Base URL**: Common URL prefix
- **Default Headers**: Shared across all requests
- **Default Authentication**: Collection-wide auth
- **Collection Variables**: Scoped to collection
- **Default Timeout**: Collection-wide timeout

## 📊 Variable Scopes (4 levels)

Variable resolution follows strict precedence (highest to lowest):

| Priority | Scope | Description | Storage |
|----------|-------|-------------|---------|
| 1 (Highest) | **Local** | Request-specific | In-memory during request |
| 2 | **Collection** | Collection-level | Collection settings |
| 3 | **Environment** | Context-specific | Environment config |
| 4 (Lowest) | **Global** | Application-wide | ~/.fd-postman-cli/globals.json |

### Variable Syntax

Variables use double curly braces: `{{variableName}}`

**Supported Locations:**
- URLs: `https://{{apiDomain}}/{{endpoint}}`
- Headers: `Authorization: Bearer {{token}}`
- Query Parameters: `?userId={{userId}}`
- Request Body: `{"name": "{{userName}}"}`
- Nested Objects: Fully recursive resolution

## 📝 History Management

| Command | Description |
|---------|-------------|
| `fp history list [--limit <n>]` | List recent requests |
| `fp history show <id>` | Show detailed entry |
| `fp history search <query>` | Search history |
| `fp history clear` | Clear all history |

## 🔄 Complete Data Flow (11 Steps)

1. **CLI Parsing** - Commander.js parses arguments
2. **Input Validation** - Validates URL, headers, etc.
3. **Request Preparation** - Builds RequestOptions
4. **Core Logic Delegation** - Hands off to RequestExecutor
5. **Variable Resolution** - Resolves {{variables}} from all scopes
6. **HTTP Request Execution** - Makes actual HTTP request
7. **Response Processing** - Captures status, headers, body
8. **Assertion Execution** - Runs test assertions (if any)
9. **History Logging** - Saves to persistent storage
10. **Output Formatting** - Formats for display
11. **Display Output** - Shows in terminal

## 💾 Data Persistence

All data stored in `~/.fd-postman-cli/`:

| File/Directory | Contents |
|----------------|----------|
| `collections/` | Collection definitions (JSON) |
| `environments/` | Environment configurations (JSON) |
| `globals.json` | Global variables |
| `active-environment.json` | Currently active environment |
| `history.json` | Request history (last 1000) |

## 🧪 Testing

| Test Type | Count | Description |
|-----------|-------|-------------|
| Unit Tests | 63 | Individual component tests |
| Integration Tests | 10 | Multi-component tests |
| E2E Tests | 5 | Full workflow tests |
| **Total** | **78** | **All Passing** ✅ |

## 📚 Command Reference

### HTTP Method Commands

```bash
fp get <url> [options]
fp post <url> [options]
fp put <url> [options]
fp delete <url> [options]
fp patch <url> [options]
fp head <url> [options]
fp options <url> [options]
```

### Management Commands

```bash
# Environments
fp env set|list|show|use|active|unuse|unset|delete

# Collections
fp collection create|list|show|run|delete

# Global Variables
fp global set|list|unset|clear

# History
fp history list|show|search|clear
```

### Global Flags

```bash
-v, --version              # Show version
-h, --help                 # Show help
```

## 🎯 Use Cases

### 1. Multi-Environment Development

```bash
# Setup
fp env set dev apiUrl=http://localhost:3000
fp env set staging apiUrl=https://staging.api.com
fp env set prod apiUrl=https://api.production.com

# Switch contexts easily
fp env use dev      # Development
fp env use staging  # Testing
fp env use prod     # Production
```

### 2. Team API Testing

```bash
# Global defaults for team
fp global set timeout=10000 userAgent="TeamApp/1.0"

# Project-specific environment
fp env set project-api apiUrl=https://project.api.com token={{personalToken}}

# Collections for organization
fp collection create "User Stories - Sprint 1"
fp collection create "Bug Fixes"
fp collection create "Smoke Tests"
```

### 3. CI/CD Integration

```bash
# Set CI environment variables
fp env set ci \
  apiUrl=$CI_API_URL \
  token=$CI_API_TOKEN

# Run test collections
fp collection run "Smoke Tests" --env ci
fp collection run "Integration Tests" --env ci
```

### 4. Local Development

```bash
# Use self-signed certificates
fp get https://localhost:8443/api --insecure

# Quick testing with variables
fp global set baseUrl=http://localhost:3000
fp get {{baseUrl}}/users
fp post {{baseUrl}}/users -d @new-user.json
```

## 🚀 Key Features

✅ **Complete REST API Support** - 7 HTTP methods  
✅ **Flexible Authentication** - 4 auth types  
✅ **Multi-Scope Variables** - 4 precedence levels  
✅ **Environment Switching** - Active environment support  
✅ **Collection Execution** - Run suites of requests  
✅ **SSL/TLS Control** - Development-friendly  
✅ **Persistent History** - Track all requests  
✅ **Test Assertions** - Automated testing  
✅ **Beautiful Output** - Color-coded, formatted  
✅ **Type-Safe** - Full TypeScript implementation  
✅ **Well-Tested** - 78 passing tests  
✅ **Documented** - Comprehensive guides  

## 📖 Documentation

- **README.md** - User guide and examples
- **ARCHITECTURE.md** - System architecture
- **DATA_FLOW.md** - Complete data flow
- **FEATURES.md** - This file
- **SETUP.md** - Development setup
- **CONTRIBUTING.md** - Contribution guide

## 🔗 Links

- **Repository**: https://github.com/Alfayads/fd-postman-cli
- **Issues**: https://github.com/Alfayads/fd-postman-cli/issues
- **npm**: (coming soon)

---

**Version**: 1.0.0  
**License**: MIT  
**Status**: ✅ Production Ready

