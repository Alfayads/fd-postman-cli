/**
 * Request execution handler
 * Orchestrates request preparation, execution, and response handling
 * Implements complete data flow from CLI input to output display
 */

import { CommandOptions, RequestOptions } from '../../models';
import { parseHeaders, parseQueryParams, parseFormData, parseData } from '../../utils/parser';
import {
  formatResponse,
  saveResponse,
  displayTestResults,
  displayFilteredResponse,
  saveHeaders,
} from '../../utils/formatter';
import { RequestExecutor } from '../../core/request-executor';
import { EnvironmentManager } from '../../core/environment-manager';
import { HistoryManager } from '../../core/history-manager';
import { TestRunner } from '../../core/test-runner';
import { FileSystem } from '../../storage/file-system';
import { HistoryStorage } from '../../storage/history-storage';
import { EnvironmentStorage } from '../../storage/environment-storage';
import { GlobalStorage } from '../../storage/global-storage';
import { validateTimeout } from '../validators';
import { logger } from '../../utils/logger';
import { buildAuthConfig, applyAuth } from '../../utils/auth';
import { extractJsonPath } from '../../utils/json-path';

// Initialize singleton instances
const fileSystem = new FileSystem();
const historyStorage = new HistoryStorage(fileSystem);
const environmentStorage = new EnvironmentStorage(fileSystem);
const globalStorage = new GlobalStorage(fileSystem);
const environmentManager = new EnvironmentManager();
const historyManager = new HistoryManager();
const testRunner = new TestRunner();

// Wire up dependencies
environmentManager.setStorage(environmentStorage);
historyManager.setStorage(historyStorage);

const requestExecutor = new RequestExecutor(environmentManager, historyManager, testRunner);

/**
 * Execute an HTTP request based on CLI options
 * Complete data flow:
 * 1. Parse and validate CLI input
 * 2. Build request options
 * 3. Resolve environment variables (if applicable)
 * 4. Execute HTTP request
 * 5. Run test assertions (if applicable)
 * 6. Log to history
 * 7. Format and display output
 */
export async function executeRequest(
  method: RequestOptions['method'],
  url: string,
  options: CommandOptions
): Promise<void> {
  try {
    logger.debug('Processing CLI input', { method, url });

    // Step 1: Parse CLI options into request options
    const headers = parseHeaders(options.header);
    const params = parseQueryParams(options.query);
    const timeout = options.timeout ? validateTimeout(String(options.timeout)) : 30000;

    // Apply authentication if specified
    const authConfig = buildAuthConfig(options);
    if (authConfig) {
      applyAuth(authConfig, headers, params);
      logger.debug('Authentication applied', { type: authConfig.type });
    }

    // Parse request body
    let data: unknown;
    if (options.data) {
      data = parseData(options.data);
    } else if (options.form) {
      data = parseFormData(options.form);
      // Set Content-Type for form data if not already set
      if (!headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
    }

    // TODO: Handle multipart form data with file uploads
    // if (options.file) { ... }

    // Step 2: Build request options
    const requestOptions: RequestOptions = {
      method,
      url,
      headers,
      params,
      data,
      timeout,
      auth: authConfig,
      rejectUnauthorized: !options.insecure, // Invert insecure flag
      maxRedirects: options.maxRedirects ? parseInt(options.maxRedirects, 10) : 5,
    };

    // Determine which environment to use
    let environmentName = options.env;

    // If no --env specified, check for active environment
    if (!environmentName) {
      const activeEnv = globalStorage.getActiveEnvironment();
      if (activeEnv) {
        environmentName = activeEnv.name;
        logger.debug('Using active environment', { name: activeEnv.name });
      }
    }

    // Get global variables for variable resolution
    const globalVars = globalStorage.getGlobalVariables();

    // Step 3-7: Execute request with complete data flow
    // This includes: variable resolution, HTTP execution, assertions, history logging
    const { response, testResults } = await requestExecutor.executeRequest(
      requestOptions,
      environmentName, // Environment name for variable resolution
      undefined, // Tests (not yet implemented from CLI)
      globalVars.variables // Global variables
    );

    // Step 8: Format and display output

    // Handle JSON path filtering if specified
    let displayData = response.data;
    if (options.filter) {
      displayData = extractJsonPath(response.data, options.filter);
      displayFilteredResponse(displayData, options.filter, options.pretty !== false);
    } else {
      // Normal response display
      formatResponse(response, options.pretty !== false, options.raw || false);
    }

    // Display test results if tests were run
    if (testResults) {
      displayTestResults(testResults);
    }

    // Save options
    if (options.output || options.saveBody) {
      saveResponse(response, options.output || options.saveBody || 'response.json');
    }

    if (options.saveHeaders) {
      saveHeaders(response.headers, options.saveHeaders);
    }

    // Save to collection if --save option is provided
    if (options.save) {
      logger.info(`Saving request to collection: ${options.save}`);
      // TODO: Implement collection save
    }

    // Exit with appropriate code based on test results
    if (testResults && !testResults.passed) {
      process.exit(1);
    }
  } catch (error) {
    logger.error('Request execution failed', error);
    throw error;
  }
}
