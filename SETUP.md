# fd-postman-cli Setup Guide

This guide will walk you through setting up the fd-postman-cli project for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git**

Check your versions:

```bash
node --version  # Should be v16.0.0 or higher
npm --version   # Should be v7.0.0 or higher
```

## Initial Setup

### 1. Clone the Repository

If you haven't already, clone the repository:

```bash
git clone <repository-url>
cd fd-postman-cli
```

### 2. Install Dependencies

Install all required dependencies:

```bash
npm install
```

This will install:
- **TypeScript** - For type-safe development
- **Commander** - For CLI argument parsing
- **Axios** - For HTTP requests
- **Chalk** - For colored terminal output
- **Jest** - For testing
- **ESLint** - For code quality
- **Prettier** - For code formatting

### 3. Build the Project

Compile TypeScript to JavaScript:

```bash
npm run build
```

This creates the `dist/` directory with compiled JavaScript files.

### 4. Link for Local Development

To use the CLI globally during development:

```bash
npm link
```

Now you can use the `fp` command from anywhere:

```bash
fp --version
fp get https://jsonplaceholder.typicode.com/posts/1
```

## Development Workflow

### Running in Development Mode

For active development with auto-recompilation:

```bash
npm run dev
```

This runs TypeScript in watch mode. Any changes to `.ts` files will trigger recompilation.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (great for TDD)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory.

### Code Quality Checks

```bash
# Lint your code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check
```

### Running the CLI Locally

After building, you can run the CLI directly:

```bash
# Using npm start (for testing)
npm start -- get https://api.example.com/data

# Or directly with node
node dist/cli.js get https://api.example.com/data

# Or if linked globally
fp get https://api.example.com/data
```

## Project Structure

```
fd-postman-cli/
├── src/                          # Source TypeScript files
│   ├── cli.ts                    # CLI entry point
│   ├── index.ts                  # Library exports
│   ├── core/                     # Core functionality
│   │   ├── request.ts            # HTTP request handler
│   │   └── request.test.ts       # Request tests
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts
│   └── utils/                    # Utility functions
│       ├── parser.ts             # Argument parsing
│       ├── parser.test.ts        # Parser tests
│       └── formatter.ts          # Response formatting
├── dist/                         # Compiled JavaScript (generated)
├── coverage/                     # Test coverage reports (generated)
├── examples/                     # Usage examples
│   ├── sample-request.json       # Sample request data
│   └── usage-examples.sh         # Example commands
├── node_modules/                 # Dependencies (generated)
├── package.json                  # Project configuration
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── .eslintrc.json                # ESLint configuration
├── .prettierrc.json              # Prettier configuration
├── .editorconfig                 # Editor configuration
├── .gitignore                    # Git ignore rules
├── .npmignore                    # npm publish ignore rules
├── README.md                     # Main documentation
├── SETUP.md                      # This file
├── CONTRIBUTING.md               # Contribution guidelines
└── LICENSE                       # MIT License
```

## Configuration Files Explained

### package.json

Main project configuration file:
- **bin**: Maps the `fp` command to `dist/cli.js`
- **main**: Entry point for library usage
- **scripts**: Development and build commands
- **dependencies**: Runtime dependencies
- **devDependencies**: Development tools

### tsconfig.json

TypeScript compiler configuration:
- Targets ES2020
- Strict type checking enabled
- Compiles `src/` to `dist/`
- Generates source maps and declarations

### jest.config.js

Testing framework configuration:
- Uses `ts-jest` preset for TypeScript
- Test files: `*.test.ts` and `*.spec.ts`
- Coverage reports in `coverage/` directory

### .eslintrc.json

Code quality rules:
- Uses TypeScript ESLint parser
- Integrates with Prettier
- Enforces best practices

### .prettierrc.json

Code formatting rules:
- Single quotes
- Semicolons
- 2-space indentation
- 100 character line width

## Testing Your Setup

After setup, verify everything works:

```bash
# 1. Build the project
npm run build

# 2. Run tests
npm test

# 3. Check linting
npm run lint

# 4. Try the CLI
fp --version
fp get https://jsonplaceholder.typicode.com/posts/1
```

If all commands succeed, your setup is complete! ✅

## Troubleshooting

### Command not found: fp

If you get "command not found" after `npm link`:

1. Make sure the build succeeded: `npm run build`
2. Try unlinking and relinking:
   ```bash
   npm unlink
   npm link
   ```
3. Check your npm global bin path is in your PATH:
   ```bash
   npm config get prefix
   ```

### TypeScript errors during build

Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Tests failing

Ensure you have internet connection (some tests make real HTTP requests).

### Permission issues on macOS/Linux

You may need to use `sudo` for global installation:
```bash
sudo npm link
```

## Next Steps

Now that your environment is set up:

1. Read the [README.md](./README.md) for usage examples
2. Check [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
3. Explore the source code in `src/`
4. Write tests for new features
5. Run the example script: `bash examples/usage-examples.sh`

## Useful Commands Reference

```bash
# Development
npm run dev              # Watch mode for development
npm run build            # Build the project
npm start                # Run the CLI locally

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Fix linting errors
npm run format           # Format code
npm run format:check     # Check code formatting

# Package Management
npm install              # Install dependencies
npm link                 # Link globally for development
npm unlink               # Unlink global package
npm run prepublishOnly   # Run before publishing

# Cleanup
rm -rf dist              # Remove build output
rm -rf node_modules      # Remove dependencies
rm -rf coverage          # Remove coverage reports
```

## Getting Help

- Check the [README.md](./README.md) for usage documentation
- Review existing [issues](https://github.com/your-repo/issues)
- Ask questions in [discussions](https://github.com/your-repo/discussions)

Happy coding! 🚀

