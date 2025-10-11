/**
 * Request Executor - Core orchestrator for request execution
 * Implements the complete data flow from request to response
 */

import { RequestOptions, ResponseData, Environment, TestAssertion, TestResult } from '../models';
import { VariableScope } from '../models/variables';
import { makeRequest } from './http-client';
import { EnvironmentManager } from './environment-manager';
import { HistoryManager } from './history-manager';
import { TestRunner } from './test-runner';
import { VariableResolver } from './variable-resolver';
import { logger } from '../utils/logger';

export class RequestExecutor {
  private environmentManager: EnvironmentManager;
  private historyManager: HistoryManager;
  private testRunner: TestRunner;

  constructor(
    environmentManager: EnvironmentManager,
    historyManager: HistoryManager,
    testRunner: TestRunner
  ) {
    this.environmentManager = environmentManager;
    this.historyManager = historyManager;
    this.testRunner = testRunner;
  }

  /**
   * Execute a request with complete data flow
   * 1. Resolve variables from all scopes (Global, Environment, Collection, Local)
   * 2. Execute HTTP request
   * 3. Run assertions (if any)
   * 4. Log to history
   * 5. Return response and test results
   */
  async executeRequest(
    options: RequestOptions,
    environmentName?: string,
    tests?: TestAssertion[],
    globalVariables?: Record<string, string>,
    collectionVariables?: Record<string, string>,
    localVariables?: Record<string, string>
  ): Promise<{ response: ResponseData; testResults?: TestResult }> {
    logger.debug('Starting request execution', { url: options.url, method: options.method });

    // Step 1: Variable Resolution with multiple scopes
    const variableResolver = new VariableResolver();

    // Set up variable scopes (in precedence order)
    if (globalVariables) {
      variableResolver.setScope(VariableScope.GLOBAL, globalVariables);
      logger.debug('Global variables loaded', { count: Object.keys(globalVariables).length });
    }

    let environment: Environment | null = null;
    if (environmentName) {
      environment = await this.environmentManager.getEnvironment(environmentName);
      if (environment) {
        variableResolver.setScope(VariableScope.ENVIRONMENT, environment.variables);
        logger.debug('Environment variables loaded', {
          environment: environment.name,
          count: Object.keys(environment.variables).length,
        });
      } else {
        logger.warn(`Environment '${environmentName}' not found`);
      }
    }

    if (collectionVariables) {
      variableResolver.setScope(VariableScope.COLLECTION, collectionVariables);
      logger.debug('Collection variables loaded', {
        count: Object.keys(collectionVariables).length,
      });
    }

    if (localVariables) {
      variableResolver.setScope(VariableScope.LOCAL, localVariables);
      logger.debug('Local variables loaded', { count: Object.keys(localVariables).length });
    }

    // Resolve all variables in request options
    const resolvedOptions = this.resolveVariablesWithResolver(options, variableResolver);

    // Step 2: HTTP Request Execution
    logger.debug('Executing HTTP request', { url: resolvedOptions.url });
    const response = await makeRequest(resolvedOptions);

    logger.info('Request completed', {
      status: response.status,
      duration: response.duration,
    });

    // Step 3: Assertion Execution (if tests are defined)
    let testResults: TestResult | undefined;
    if (tests && tests.length > 0) {
      logger.debug('Running test assertions', { testCount: tests.length });
      testResults = this.testRunner.runTests(tests, response);
      logger.info('Tests completed', {
        passed: testResults.passed,
        total: testResults.assertions.length,
      });
    }

    // Step 4: History Logging
    try {
      logger.debug('Logging request to history');
      await this.historyManager.addEntry(resolvedOptions, response);
    } catch (error) {
      logger.warn('Failed to log request to history', error);
      // Don't fail the request if history logging fails
    }

    return { response, testResults };
  }

  /**
   * Resolve variables in request options using variable resolver
   * Supports multiple scopes with proper precedence
   */
  private resolveVariablesWithResolver(
    options: RequestOptions,
    resolver: VariableResolver
  ): RequestOptions {
    const resolved: RequestOptions = { ...options };

    // Resolve URL
    resolved.url = resolver.resolve(options.url);

    // Resolve headers
    if (options.headers) {
      resolved.headers = {};
      for (const [key, value] of Object.entries(options.headers)) {
        const resolvedKey = resolver.resolve(key);
        const resolvedValue = resolver.resolve(value);
        resolved.headers[resolvedKey] = resolvedValue;
      }
    }

    // Resolve query parameters
    if (options.params) {
      resolved.params = {};
      for (const [key, value] of Object.entries(options.params)) {
        const resolvedKey = resolver.resolve(key);
        const resolvedValue = resolver.resolve(value);
        resolved.params[resolvedKey] = resolvedValue;
      }
    }

    // Resolve request body
    if (typeof options.data === 'string') {
      resolved.data = resolver.resolve(options.data);
    } else if (options.data && typeof options.data === 'object') {
      resolved.data = resolver.resolveObject(options.data);
    }

    return resolved;
  }
}
