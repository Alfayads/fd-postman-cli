# fd-postman-cli Architecture

This document describes the architecture and directory structure of the fd-postman-cli project.

## Overview

The fd-postman-cli is designed with a clean, layered architecture that separates concerns and promotes maintainability. The codebase follows best practices for TypeScript development and adheres to SOLID principles.

## Directory Structure

```
fd-postman-cli/
├── src/
│   ├── cli/                          # CLI Layer
│   │   ├── commands/                 # Command implementations
│   │   │   ├── get.ts               # GET command
│   │   │   ├── post.ts              # POST command
│   │   │   ├── put.ts               # PUT command
│   │   │   ├── delete.ts            # DELETE command
│   │   │   └── patch.ts             # PATCH command
│   │   ├── handlers/                 # Request handlers
│   │   │   └── request-handler.ts   # Main request execution handler
│   │   ├── index.ts                  # CLI entry point
│   │   └── validators.ts             # Input validation
│   │
│   ├── core/                         # Core Business Logic
│   │   ├── http-client.ts           # HTTP request engine
│   │   ├── collection-manager.ts    # Collection management
│   │   ├── environment-manager.ts   # Environment management
│   │   └── history-manager.ts       # History management
│   │
│   ├── storage/                      # Storage Layer
│   │   ├── file-system.ts           # File system abstraction
│   │   ├── collection-storage.ts    # Collection persistence
│   │   ├── environment-storage.ts   # Environment persistence
│   │   ├── history-storage.ts       # History persistence
│   │   └── index.ts                 # Storage exports
│   │
│   ├── models/                       # Data Models
│   │   └── index.ts                 # Type definitions
│   │
│   ├── utils/                        # Utilities
│   │   ├── parser.ts                # Argument parsing
│   │   ├── formatter.ts             # Response formatting
│   │   ├── logger.ts                # Logging utilities
│   │   ├── variables.ts             # Variable interpolation
│   │   ├── errors.ts                # Error handling
│   │   └── paths.ts                 # Path management
│   │
│   └── index.ts                      # Main library exports
│
├── tests/                            # Test Suite
│   ├── unit/                         # Unit tests
│   │   ├── core/                    # Core module tests
│   │   ├── storage/                 # Storage tests
│   │   └── utils/                   # Utility tests
│   ├── integration/                  # Integration tests
│   └── e2e/                         # End-to-end tests
│
├── examples/                         # Usage examples
├── dist/                            # Compiled output
└── Configuration files

```

## Architectural Layers

### 1. CLI Layer (`src/cli/`)

**Responsibility**: Handle command-line interface interactions

The CLI layer is responsible for:
- Parsing command-line arguments using Commander.js
- Validating user input
- Orchestrating calls to core business logic
- Presenting results to the user

**Key Components**:
- **commands/**: Each HTTP method has its own command file (get, post, put, delete, patch)
- **handlers/**: Request execution handler that coordinates between CLI and core logic
- **validators.ts**: Input validation functions for URLs, headers, query params, etc.
- **index.ts**: Main CLI entry point that registers all commands

**Design Principles**:
- Each command is isolated in its own file for better maintainability
- Validation happens at the CLI layer before passing data to core
- CLI layer doesn't contain business logic - only orchestration

### 2. Core Layer (`src/core/`)

**Responsibility**: Business logic independent of CLI and storage

The core layer contains the main business logic:
- HTTP request/response handling
- Collection, environment, and history management
- Request chaining and workflow execution
- Test assertions and validations

**Key Components**:
- **http-client.ts**: Makes HTTP requests using Axios, handles errors
- **collection-manager.ts**: CRUD operations for collections
- **environment-manager.ts**: Environment variable management and interpolation
- **history-manager.ts**: Request history tracking

**Design Principles**:
- Independent of CLI and storage implementations
- Can be used as a library by other applications
- Pure business logic with no side effects
- Uses dependency injection for storage

### 3. Storage Layer (`src/storage/`)

**Responsibility**: Data persistence and retrieval

The storage layer abstracts all file system operations:
- Reading and writing JSON files
- Managing the ~/.fd-postman-cli directory
- CRUD operations for collections, environments, and history

**Key Components**:
- **file-system.ts**: Low-level file operations abstraction
- **collection-storage.ts**: Collection persistence
- **environment-storage.ts**: Environment persistence
- **history-storage.ts**: History persistence

**Design Principles**:
- Abstract layer for file operations
- Easy to replace with database or cloud storage
- All storage operations go through this layer
- Uses ~/.fd-postman-cli as default data directory

### 4. Models Layer (`src/models/`)

**Responsibility**: Data structures and type definitions

Defines TypeScript interfaces and types for:
- Request and response objects
- Collections and collection requests
- Environments and variables
- History entries
- Workflows and test assertions
- Command options

**Design Principles**:
- Single source of truth for data structures
- Exported for use throughout the application
- Well-documented with JSDoc comments

### 5. Utils Layer (`src/utils/`)

**Responsibility**: Reusable helper functions

Generic utilities used across layers:
- **parser.ts**: Parse CLI arguments (headers, query params, form data)
- **formatter.ts**: Format and display HTTP responses
- **logger.ts**: Structured logging with levels
- **variables.ts**: Variable interpolation ({{variable}} syntax)
- **errors.ts**: Custom error types and error handling
- **paths.ts**: Path management utilities

**Design Principles**:
- Pure functions with no side effects
- Reusable across different layers
- Well-tested with unit tests

## Data Flow

```
User Input (CLI)
    ↓
CLI Commands (parse & validate)
    ↓
Request Handler (orchestrate)
    ↓
Core Business Logic (execute)
    ↓
Storage Layer (persist)
    ↓
File System (~/.fd-postman-cli)
```

## Testing Strategy

### Unit Tests (`tests/unit/`)
- Test individual functions and classes in isolation
- Mock dependencies
- Fast execution
- High coverage of business logic

### Integration Tests (`tests/integration/`)
- Test interactions between modules
- Verify layers work together correctly
- Use real implementations (not mocks)

### End-to-End Tests (`tests/e2e/`)
- Simulate real user workflows
- Test complete command executions
- Verify entire system works as expected

## Configuration Files

### TypeScript Configuration
- **tsconfig.json**: Main TypeScript configuration for compilation
- **tsconfig.eslint.json**: Extended config for ESLint (includes test files)

### Testing Configuration
- **jest.config.js**: Jest test runner configuration
- Tests located in `tests/` directory
- Coverage reports in `coverage/` directory

### Code Quality
- **.eslintrc.json**: ESLint rules for code quality
- **.prettierrc.json**: Prettier formatting rules
- **.editorconfig**: Cross-editor consistency

### Package Management
- **package.json**: Project metadata and dependencies
  - `bin` field maps `fp` command to `dist/cli/index.js`
  - `main` field points to `dist/index.js` for library usage

## Runtime Data Directory

### ~/.fd-postman-cli/
```
~/.fd-postman-cli/
├── collections/           # Saved collections
│   ├── {id}.json
│   └── ...
├── environments/          # Environment configurations
│   ├── {id}.json
│   └── ...
└── history.json          # Request history
```

## Extension Points

The architecture is designed to be extensible:

1. **New Commands**: Add new command files in `src/cli/commands/`
2. **New Storage Backends**: Implement storage interface for databases/cloud
3. **Custom Formatters**: Add new formatters in `src/utils/`
4. **Plugin System**: Can be added to extend functionality
5. **GraphQL Support**: Can be added as new core module

## Design Patterns Used

- **Layered Architecture**: Separation of concerns across layers
- **Dependency Injection**: Core managers accept storage dependencies
- **Factory Pattern**: ID generation in managers
- **Strategy Pattern**: Different storage implementations
- **Command Pattern**: CLI command structure
- **Repository Pattern**: Storage layer abstracts data access

## Best Practices

1. **TypeScript Strict Mode**: Enabled for type safety
2. **No Circular Dependencies**: Layers flow one direction
3. **Single Responsibility**: Each module has one clear purpose
4. **DRY Principle**: Utilities prevent code duplication
5. **Testability**: Architecture supports easy testing
6. **Documentation**: All modules have clear documentation
7. **Error Handling**: Centralized error handling in utils

## Future Enhancements

Potential additions to the architecture:

1. **Plugin System**: Load external plugins
2. **WebSocket Support**: Real-time API testing
3. **GraphQL Support**: GraphQL query execution
4. **Mock Server**: Built-in mock server
5. **Test Runner**: Automated test suites
6. **CI/CD Integration**: Pipeline support
7. **Cloud Sync**: Sync data across devices
8. **Team Collaboration**: Shared collections

## Contributing

When contributing to this project:

1. Follow the existing directory structure
2. Keep layers separate and independent
3. Write tests for new functionality
4. Update this document for architectural changes
5. Use TypeScript strict mode
6. Follow ESLint and Prettier rules

## Performance Considerations

- **Lazy Loading**: Modules loaded only when needed
- **Async Operations**: All I/O operations are async
- **File Caching**: Consider caching for frequently accessed files
- **Streaming**: For large responses, consider streaming
- **Indexing**: For large history, consider indexing

## Security Considerations

- **Input Validation**: All user input validated at CLI layer
- **Path Traversal**: File operations use safe path resolution
- **Credential Storage**: Sensitive data should be encrypted
- **HTTPS**: Enforce HTTPS for production APIs
- **Rate Limiting**: Consider rate limiting for API calls

---

For more information, see:
- [README.md](./README.md) - User documentation
- [SETUP.md](./SETUP.md) - Development setup
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

