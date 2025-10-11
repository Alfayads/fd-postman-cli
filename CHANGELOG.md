# Changelog

All notable changes to fd-postman-cli will be documented in this file.

## [2.1.0] - 2025-01-11

### Added - Shell Autocomplete with Emoji Icons 🎨

- **Beautiful Shell Completions**: Emoji-enhanced autocomplete for Bash, Zsh, and Fish shells
- **Smart Suggestions**: Context-aware completions that change based on what you're typing
- **Visual Icons**: Every command has an emoji icon (🌐📤🔄🗑️✏️📋⚙️🌍📦📜🔐)
- **Helpful Descriptions**: See what each command does right in your terminal
- **Auto-Installer**: One-click installation script with automatic shell detection
- **Complete Documentation**: 
  - Full guide (docs/AUTOCOMPLETE.md)
  - Quick reference card (docs/AUTOCOMPLETE_QUICKREF.md)
- **Completion Features**:
  - All main commands with descriptions
  - All subcommands for env, collection, global, history, workflow, auth
  - All options with helpful descriptions
  - Authentication type suggestions
  - Environment and collection name completion
  - Partial matching and tab cycling support

### Changed

- Updated README.md with autocomplete installation section
- Added `completions` directory to npm package
- Added postinstall tip to guide users to enable autocomplete
- Updated package.json with files array and postinstall script

### Documentation

- Added comprehensive autocomplete guide (338 lines)
- Added quick reference card (175 lines)
- Updated installation instructions

## [Unreleased]

### Added - v2.0.0 (Request Chaining, Workflows & Import/Export)

#### Request Chaining & Workflows
- **WorkflowEngine**: Sequential request execution with variable capture
- **Workflow Commands**:
  - `fp workflow create <name>` - Create workflow template
  - `fp workflow run <file>` - Execute workflow from file
- **Variable Extraction**: Extract data from responses using JSON path
- **Multi-Scope Variables**: workflow, environment, and global scopes
- **Continue on Error**: Optional error handling per step
- **Workflow Templates**: Pre-configured templates for common flows

#### Import & Export
- **Export Commands**:
  - `fp export collection <name>` - Export specific collection
  - `fp export env <name>` - Export specific environment
  - `fp export all` - Export all collections and environments
- **Import Commands**:
  - `fp import collection <file>` - Import collection from file
  - `fp import env <file>` - Import environment from file
- **Merge Support**: `--merge` flag to merge with existing data
- **Backup & Migration**: Easy backup and migration between machines

#### History & Replay
- **History Replay**:
  - `fp history replay <id>` - Replay request from history
  - `fp history rerun <id>` - Alias for replay
- **Enhanced History Display**: Shows request IDs for easy replay
- **Improved Search**: Better search results with IDs

#### Core Improvements
- **Workflow Model**: New data model for workflows and steps
- **Variable Capture**: Extract and store response data
- **Sequential Execution**: Execute multiple requests in order
- **Error Handling**: Graceful error handling with continue-on-error
- **Progress Reporting**: Real-time progress during workflow execution

### Technical Details
- Added `WorkflowEngine` class for orchestration
- Added `workflow.ts` command file
- Added `export.ts` and `import.ts` command files
- Enhanced history commands with replay functionality
- Updated models to support workflows
- All features fully tested (93 tests passing)
- Comprehensive documentation added

## [1.0.0] - Previous Release

### Added - v1.0.0 (Response Handling & Testing)

#### Response Handling & Viewing
- Pretty-printed output (default)
- Raw response view (`--raw`)
- Response headers display
- Response filtering with JQ-like syntax (`--filter`)
- Saving responses to files (`--save-headers`, `--save-body`)

#### Assertions & Testing
- Test definitions
- Assertion types (status code, header, body content, duration)
- Test reporting
- Collection-level testing

#### Core Features (Initial Release)
- HTTP methods: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- Authentication: Bearer Token, Basic Auth, API Key
- SSL/TLS control (`--insecure`)
- Request configuration (timeout, redirects)
- Collections & Organization
- Environments & Variables
- Global variables support
- Multi-scope variable resolution
- Active environment tracking
- Collection runner
- History logging
- Beautiful CLI with animations

---

## Migration Guide

### From v1.x to v2.0

#### New Commands
```bash
# Workflows
fp workflow create "My Flow"
fp workflow run my-flow.workflow.json

# Export/Import
fp export collection "My Collection"
fp import collection backup.collection.json

# History Replay
fp history replay <id>
```

#### Breaking Changes
- None! All v1.x commands remain fully compatible

#### New Features You Can Use Immediately
1. **Chain Requests**: Create workflows to execute multiple requests sequentially
2. **Backup Data**: Export collections and environments for backup
3. **Replay Requests**: Quickly replay any past request from history
4. **Variable Capture**: Extract data from responses for use in subsequent requests

---

## Upgrade Instructions

```bash
# Global installation
npm update -g fd-postman-cli

# Local development
git pull origin main
npm install
npm run build
```

---

## Contributors

- **Alfayad** - Initial work and ongoing development
  - Portfolio: https://alfayad.vercel.app


