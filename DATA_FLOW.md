# fd-postman-cli Data Flow & Interactions

This document describes the complete data flow for executing commands in fd-postman-cli, from user input to output display.

## Overview

The fd-postman-cli follows a layered architecture where data flows through multiple layers, each responsible for specific tasks. This ensures separation of concerns and maintainability.

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INPUT                                     │
│                    Terminal: fp get <URL> [options]                      │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      STEP 1: CLI PARSING                                 │
│  • Commander.js parses command, arguments, and options                   │
│  • Extracts: method, URL, headers, query params, data, etc.             │
│  Location: src/cli/commands/*.ts                                        │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 2: INPUT VALIDATION                              │
│  • Validate URL format                                                   │
│  • Validate header format (Key: Value)                                   │
│  • Validate query parameter format (key=value)                           │
│  • Validate timeout value                                                │
│  Location: src/cli/validators.ts                                        │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 STEP 3: REQUEST PREPARATION                              │
│  • Parse CLI options into RequestOptions                                 │
│  • Parse headers (parseHeaders)                                          │
│  • Parse query parameters (parseQueryParams)                             │
│  • Parse request body (parseData) - supports JSON or @file              │
│  • Parse form data (parseFormData)                                       │
│  Location: src/cli/handlers/request-handler.ts                          │
│            src/utils/parser.ts                                           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              STEP 4: CORE LOGIC DELEGATION                               │
│  • Hand off to RequestExecutor                                           │
│  • Pass RequestOptions, environment name, tests                          │
│  Location: src/core/request-executor.ts                                 │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│         STEP 5: VARIABLE RESOLUTION (if --env provided)                  │
│  • Retrieve environment from EnvironmentManager                          │
│  • Interpolate {{variables}} in:                                         │
│    - URL                                                                 │
│    - Headers (keys and values)                                           │
│    - Query parameters (keys and values)                                  │
│    - Request body (recursively for objects)                              │
│  • Uses {{variable}} syntax                                              │
│  Location: src/core/request-executor.ts                                 │
│            src/utils/variables.ts                                        │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              STEP 6: HTTP REQUEST EXECUTION                              │
│  • Use Axios to send HTTP request                                        │
│  • Set method, URL, headers, params, body, timeout                       │
│  • Track request duration                                                │
│  • Handle network errors gracefully                                      │
│  Location: src/core/http-client.ts                                      │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 7: RESPONSE PROCESSING                             │
│  • Capture response status, headers, body                                │
│  • Calculate total duration                                              │
│  • Build ResponseData object                                             │
│  Location: src/core/http-client.ts                                      │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│        STEP 8: ASSERTION EXECUTION (if tests provided)                   │
│  • Run test assertions against response                                  │
│  • Support assertions on:                                                │
│    - status (response.status === 200)                                    │
│    - headers (response.headers.*)                                        │
│    - data fields (response.data.*)                                       │
│    - duration                                                            │
│  • Compare actual vs expected values                                     │
│  • Generate TestResult with pass/fail status                             │
│  Location: src/core/test-runner.ts                                      │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   STEP 9: HISTORY LOGGING                                │
│  • Create HistoryEntry with:                                             │
│    - Unique ID                                                           │
│    - Request details (resolved)                                          │
│    - Response details                                                    │
│    - Timestamp                                                           │
│  • Save to history storage (~/.fd-postman-cli/history.json)             │
│  • Keep last 1000 entries                                                │
│  Location: src/core/history-manager.ts                                  │
│            src/storage/history-storage.ts                                │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 10: OUTPUT FORMATTING                              │
│  • Format response for display:                                          │
│    - Status line (colored by status code)                                │
│    - Duration in milliseconds                                            │
│    - Response headers                                                    │
│    - Response body (pretty-printed JSON if applicable)                   │
│  • Format test results (if tests were run):                              │
│    - Overall pass/fail status                                            │
│    - Test duration                                                       │
│    - Individual assertion results                                        │
│    - Expected vs actual for failed tests                                 │
│  Location: src/utils/formatter.ts                                       │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 11: DISPLAY OUTPUT                               │
│  • Print formatted response to console                                   │
│  • Print test results (if applicable)                                    │
│  • Save to file if --output provided                                     │
│  • Exit with code 0 (success) or 1 (tests failed)                       │
│  Location: src/cli/handlers/request-handler.ts                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Detailed Flow for `fp get <URL>`

### Example Command

```bash
fp get https://api.example.com/users/1 \
  --env production \
  -H "Authorization: Bearer {{token}}" \
  -q "include=profile" \
  --output response.json
```

### Step-by-Step Execution

#### 1. User Input
```
User types command in terminal
↓
Shell passes arguments to fp executable
↓
Node.js executes dist/cli/index.js
```

#### 2. CLI Parsing (src/cli/commands/get.ts)
```javascript
program
  .command('get <url>')
  .option('-H, --header <headers...>')
  .option('-q, --query <params...>')
  .option('--env <name>')
  .option('-o, --output <file>')
  .action(async (url, options) => {
    // Validates URL
    validateUrl(url);
    
    // Delegates to request handler
    await executeRequest('GET', url, options);
  });
```

**Output:**
- url: `"https://api.example.com/users/1"`
- options: `{ env: 'production', header: [...], query: [...], output: 'response.json' }`

#### 3. Input Validation (src/cli/validators.ts)
```javascript
validateUrl(url)
  → Checks URL format using URL constructor
  → Throws ValidationError if invalid

validateHeader(header)
  → Checks for ":" or "=" separator
  → Throws ValidationError if invalid format
```

#### 4. Request Preparation (src/cli/handlers/request-handler.ts)
```javascript
// Parse headers
const headers = parseHeaders(options.header);
// Result: { "Authorization": "Bearer {{token}}" }

// Parse query parameters
const params = parseQueryParams(options.query);
// Result: { "include": "profile" }

// Build RequestOptions
const requestOptions = {
  method: 'GET',
  url: 'https://api.example.com/users/1',
  headers: { "Authorization": "Bearer {{token}}" },
  params: { "include": "profile" },
  timeout: 30000
};
```

#### 5. Core Logic Delegation (src/core/request-executor.ts)
```javascript
const { response, testResults } = await requestExecutor.executeRequest(
  requestOptions,
  'production' // environment name
);
```

#### 6. Variable Resolution
```javascript
// Fetch environment
const environment = await environmentManager.getEnvironment('production');
// environment.variables = { "token": "abc123xyz", "baseUrl": "..." }

// Interpolate variables
resolvedOptions.url = interpolateVariables(url, environment.variables);
// No {{variables}} in URL, stays the same

resolvedOptions.headers.Authorization = 
  interpolateVariables("Bearer {{token}}", environment.variables);
// Result: "Bearer abc123xyz"
```

#### 7. HTTP Request Execution (src/core/http-client.ts)
```javascript
const startTime = Date.now();

const response = await axios({
  method: 'GET',
  url: 'https://api.example.com/users/1',
  headers: { "Authorization": "Bearer abc123xyz" },
  params: { "include": "profile" },
  timeout: 30000
});

const duration = Date.now() - startTime;
// duration: 142 (ms)
```

#### 8. Response Processing
```javascript
const responseData = {
  status: 200,
  statusText: 'OK',
  headers: {
    'content-type': 'application/json',
    'content-length': '234'
  },
  data: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    profile: { ... }
  },
  duration: 142
};
```

#### 9. Assertion Execution (if tests provided)
```javascript
// Example tests
const tests = [
  { name: 'Status is 200', assertion: 'status', expected: 200 },
  { name: 'Has user name', assertion: 'data.name', expected: 'John Doe' }
];

const testResults = testRunner.runTests(tests, responseData);
// testResults = {
//   name: 'API Tests',
//   passed: true,
//   assertions: [
//     { name: 'Status is 200', passed: true, actual: 200, expected: 200 },
//     { name: 'Has user name', passed: true, actual: 'John Doe', expected: 'John Doe' }
//   ],
//   duration: 2
// }
```

#### 10. History Logging (src/core/history-manager.ts)
```javascript
const entry = {
  id: '1234567890-abc',
  request: resolvedOptions,
  response: responseData,
  timestamp: new Date('2025-10-09T12:34:56')
};

await historyStorage.add(entry);
// Saved to ~/.fd-postman-cli/history.json
```

#### 11. Output Formatting (src/utils/formatter.ts)
```javascript
formatResponse(responseData, pretty=true);

// Console output:
// Status: 200 OK (green)
// Duration: 142ms
//
// Headers:
//   content-type: application/json
//   content-length: 234
//
// Response Body:
// {
//   "id": 1,
//   "name": "John Doe",
//   "email": "john@example.com",
//   ...
// }
```

#### 12. Display Output
```javascript
// Print to console (already done above)

// Save to file if --output provided
if (options.output) {
  saveResponse(responseData, 'response.json');
  // ✓ Response saved to: response.json
}

// Exit with appropriate code
if (testResults && !testResults.passed) {
  process.exit(1); // Tests failed
}
// process.exit(0) // Success (default)
```

## Error Handling Flow

Errors can occur at any step and are handled appropriately:

```
┌─────────────────┐
│  Error Occurs   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Is it a ValidationError?        │
│  (CLI layer)                    │
├─────────┬───────────────────────┤
│   YES   │         NO            │
└────┬────┴───────┬───────────────┘
     │            │
     ▼            ▼
Display      Is it a RequestError?
error msg    (Network/HTTP error)
Exit code 1  ├────┬──────────────┤
             │ YES│      NO      │
             └──┬─┴──────┬───────┘
                │        │
                ▼        ▼
           Log error  Unknown error
           Show msg   Log stack trace
           Exit 1     Exit 1
```

## Data Storage Locations

### Runtime Data Directory: `~/.fd-postman-cli/`

```
~/.fd-postman-cli/
├── collections/              # Saved request collections
│   ├── {collection-id}.json
│   └── ...
├── environments/             # Environment configurations
│   ├── {environment-id}.json
│   └── ...
└── history.json             # Request history (last 1000)
```

### History Entry Format
```json
{
  "id": "1234567890-abc",
  "request": {
    "method": "GET",
    "url": "https://api.example.com/users/1",
    "headers": { "Authorization": "Bearer abc123xyz" },
    "params": { "include": "profile" }
  },
  "response": {
    "status": 200,
    "statusText": "OK",
    "headers": { ... },
    "data": { ... },
    "duration": 142
  },
  "timestamp": "2025-10-09T12:34:56.789Z"
}
```

## Module Interactions

### Request Execution Sequence Diagram

```
CLI Command → Request Handler → Request Executor → HTTP Client
     │              │                   │                │
     │              │                   ├─→ Environment Manager
     │              │                   │   (resolve variables)
     │              │                   │
     │              │                   ├─→ HTTP Client
     │              │                   │   (make request)
     │              │                   │
     │              │                   ├─→ Test Runner
     │              │                   │   (run assertions)
     │              │                   │
     │              │                   └─→ History Manager
     │              │                       (log to storage)
     │              │                             │
     │              │                             └─→ History Storage
     │              │                                 (persist to file)
     │              │
     │              ├─→ Formatter
     │              │   (format output)
     │              │
     │              └─→ Console
     │                  (display)
     └─→ Exit
```

## Performance Considerations

1. **Lazy Initialization**: Managers and storage are initialized only when needed
2. **Async Operations**: All I/O operations (HTTP, file system) are async
3. **History Limiting**: Only last 1000 entries kept to prevent file bloat
4. **Error Recovery**: Failures in non-critical steps (e.g., history logging) don't fail the request

## Security Considerations

1. **Input Validation**: All user input validated before processing
2. **Path Safety**: File operations use safe path resolution
3. **Variable Interpolation**: Only resolves {{variable}} syntax
4. **No Code Execution**: Data is never eval'd or executed

## Extension Points

The data flow can be extended at several points:

1. **Pre-Request Scripts**: Add hook before HTTP execution
2. **Post-Response Scripts**: Add hook after response received
3. **Custom Formatters**: Add new output formats
4. **Plugins**: Inject custom logic at any step
5. **Alternative Storage**: Replace file system with database

---

For architectural details, see [ARCHITECTURE.md](./ARCHITECTURE.md)
For usage examples, see [README.md](./README.md)

