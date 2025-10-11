/**
 * Collection Runner - Executes all requests in a collection
 */

import { Collection, CollectionRequest, ResponseData, TestResult } from '../models';
import { RequestExecutor } from './request-executor';
import { logger } from '../utils/logger';
import chalk from 'chalk';

export interface CollectionRunResult {
  collectionName: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  results: RequestRunResult[];
  totalDuration: number;
}

export interface RequestRunResult {
  request: CollectionRequest;
  response?: ResponseData;
  testResults?: TestResult;
  error?: string;
  success: boolean;
}

export class CollectionRunner {
  private requestExecutor: RequestExecutor;

  constructor(requestExecutor: RequestExecutor) {
    this.requestExecutor = requestExecutor;
  }

  /**
   * Run all requests in a collection
   */
  async runCollection(
    collection: Collection,
    environmentName?: string,
    globalVariables?: Record<string, string>
  ): Promise<CollectionRunResult> {
    const startTime = Date.now();
    const results: RequestRunResult[] = [];
    let successfulRequests = 0;
    let failedRequests = 0;

    console.log(chalk.bold(`\n▶ Running Collection: ${chalk.cyan(collection.name)}`));
    console.log(chalk.gray(`  Requests: ${collection.requests.length}`));
    if (environmentName) {
      console.log(chalk.gray(`  Environment: ${environmentName}`));
    }
    if (collection.settings?.variables) {
      console.log(
        chalk.gray(`  Collection Variables: ${Object.keys(collection.settings.variables).length}`)
      );
    }
    console.log('');

    for (let i = 0; i < collection.requests.length; i++) {
      const request = collection.requests[i];
      if (!request) continue;

      console.log(
        chalk.gray(`[${i + 1}/${collection.requests.length}]`),
        chalk.cyan(`${request.method} ${request.name}`)
      );

      try {
        const result = await this.runRequest(request, collection, environmentName, globalVariables);

        results.push(result);

        if (result.success) {
          successfulRequests++;
          console.log(
            chalk.green(
              `  ✓ ${result.response?.status} ${result.response?.statusText} (${result.response?.duration}ms)`
            )
          );
        } else {
          failedRequests++;
          console.log(chalk.red(`  ✗ ${result.error || 'Request failed'}`));
        }

        // Display test results if any
        if (result.testResults) {
          const passedTests = result.testResults.assertions.filter((a) => a.passed).length;
          const totalTests = result.testResults.assertions.length;

          if (result.testResults.passed) {
            console.log(chalk.green(`  ✓ Tests: ${passedTests}/${totalTests} passed`));
          } else {
            console.log(chalk.red(`  ✗ Tests: ${passedTests}/${totalTests} passed`));
            // Show failed assertions
            result.testResults.assertions
              .filter((a) => !a.passed)
              .forEach((assertion) => {
                console.log(chalk.red(`    ✗ ${assertion.name}`));
              });
          }
        }

        console.log('');
      } catch (error) {
        failedRequests++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          request,
          success: false,
          error: errorMessage,
        });
        console.log(chalk.red(`  ✗ Error: ${errorMessage}`));
        console.log('');
      }
    }

    const totalDuration = Date.now() - startTime;

    // Summary
    console.log(chalk.bold('═'.repeat(60)));
    console.log(chalk.bold('Collection Run Summary:'));
    console.log(chalk.gray(`  Collection: ${collection.name}`));
    console.log(chalk.gray(`  Total Requests: ${collection.requests.length}`));
    console.log(chalk.green(`  Successful: ${successfulRequests}`));
    if (failedRequests > 0) {
      console.log(chalk.red(`  Failed: ${failedRequests}`));
    }
    console.log(chalk.gray(`  Total Duration: ${totalDuration}ms`));
    console.log(chalk.bold('═'.repeat(60)));
    console.log('');

    return {
      collectionName: collection.name,
      totalRequests: collection.requests.length,
      successfulRequests,
      failedRequests,
      results,
      totalDuration,
    };
  }

  /**
   * Run a single request from a collection
   */
  private async runRequest(
    request: CollectionRequest,
    collection: Collection,
    environmentName?: string,
    globalVariables?: Record<string, string>
  ): Promise<RequestRunResult> {
    try {
      // Build request URL
      let url = request.url;

      // Apply collection base URL if set and URL is relative
      if (collection.settings?.baseUrl && !url.startsWith('http')) {
        url = collection.settings.baseUrl + (url.startsWith('/') ? '' : '/') + url;
      }

      // Merge headers (collection defaults + request specific)
      const headers = {
        ...(collection.settings?.headers || {}),
        ...(request.headers || {}),
      };

      // Get collection variables
      const collectionVariables = collection.settings?.variables;

      // Execute request with all variable scopes
      const { response, testResults } = await this.requestExecutor.executeRequest(
        {
          method: request.method,
          url,
          headers,
          params: request.params,
          data: request.body,
          timeout: collection.settings?.timeout,
          auth: collection.settings?.auth,
        },
        environmentName,
        request.tests,
        globalVariables,
        collectionVariables
      );

      // Determine success based on response status and tests
      const success =
        response.status >= 200 && response.status < 400 && (!testResults || testResults.passed);

      return {
        request,
        response,
        testResults,
        success,
      };
    } catch (error) {
      logger.error('Request execution failed', { request: request.name, error });
      return {
        request,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
