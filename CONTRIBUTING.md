# Contributing to fd-postman-cli

Thank you for your interest in contributing to fd-postman-cli! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/fd-postman-cli.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`

## Development Workflow

### Building the Project

```bash
npm run build
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing Locally

After building, you can test your changes locally:

```bash
# Build the project
npm run build

# Link globally
npm link

# Test the CLI
fp get https://api.example.com/data
```

## Code Style

- We use **TypeScript** for type safety
- **ESLint** enforces code quality rules
- **Prettier** ensures consistent formatting
- Follow the existing code style in the project

## Commit Messages

Write clear and descriptive commit messages:

```
feat: Add support for GraphQL requests
fix: Handle timeout errors properly
docs: Update README with new examples
test: Add tests for parser utilities
refactor: Improve request error handling
```

## Pull Request Process

1. Ensure your code passes all tests: `npm test`
2. Ensure your code passes linting: `npm run lint`
3. Update documentation if needed
4. Write or update tests for your changes
5. Submit a pull request with a clear description of your changes

## Adding New Features

When adding new features:

1. Discuss major changes in an issue first
2. Write tests for your feature
3. Update the README with usage examples
4. Ensure backward compatibility when possible

## Reporting Bugs

When reporting bugs, please include:

- A clear description of the issue
- Steps to reproduce the behavior
- Expected behavior
- Actual behavior
- Your environment (OS, Node.js version, etc.)

## Questions?

Feel free to open an issue for any questions or concerns.

Thank you for contributing! 🎉

