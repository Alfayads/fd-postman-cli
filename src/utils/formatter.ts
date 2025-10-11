/**
 * Utility functions for formatting and displaying responses
 */

import * as fs from 'fs';
import chalk from 'chalk';
import { ResponseData } from '../models';

/**
 * Format and display HTTP response
 */
export function formatResponse(response: ResponseData, pretty = true, raw = false): void {
  if (raw) {
    // Raw mode: show unformatted response
    console.log('\n' + chalk.gray('━'.repeat(70)));
    console.log(chalk.bold('RAW RESPONSE'));
    console.log(chalk.gray('━'.repeat(70)));
    console.log(typeof response.data === 'object' ? JSON.stringify(response.data) : response.data);
    console.log(chalk.gray('━'.repeat(70)) + '\n');
    return;
  }

  // Formatted mode
  // Status line
  const statusColor = getStatusColor(response.status);
  console.log(chalk.bold('\nStatus:'), statusColor(`${response.status} ${response.statusText}`));

  // Duration
  console.log(chalk.bold('Duration:'), chalk.cyan(`${response.duration}ms`));

  // Headers
  console.log(chalk.bold('\nHeaders:'));
  Object.entries(response.headers).forEach(([key, value]) => {
    console.log(chalk.gray(`  ${key}:`), value);
  });

  // Response body
  console.log(chalk.bold('\nResponse Body:'));
  if (response.data) {
    if (typeof response.data === 'object') {
      console.log(pretty ? JSON.stringify(response.data, null, 2) : JSON.stringify(response.data));
    } else {
      console.log(response.data);
    }
  } else {
    console.log(chalk.gray('  (empty)'));
  }

  console.log(''); // Empty line at the end
}

/**
 * Display filtered response data
 */
export function displayFilteredResponse(data: unknown, path: string, pretty = true): void {
  console.log(chalk.bold('\nFiltered Response ') + chalk.cyan(`(${path})`) + chalk.bold(':'));

  if (data === undefined) {
    console.log(chalk.yellow('  (no data found at path)'));
  } else if (typeof data === 'object') {
    console.log(pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data));
  } else {
    console.log(chalk.white(String(data)));
  }

  console.log('');
}

/**
 * Save headers to file
 */
export function saveHeaders(headers: Record<string, string>, filePath: string): void {
  try {
    const content = Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(chalk.green(`\n✓ Headers saved to: ${filePath}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\n✗ Failed to save headers: ${error.message}`));
    }
  }
}

/**
 * Save response to file
 */
export function saveResponse(response: ResponseData, filePath: string): void {
  try {
    let content: string;

    if (typeof response.data === 'object') {
      content = JSON.stringify(response.data, null, 2);
    } else {
      content = String(response.data);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(chalk.green(`\n✓ Response saved to: ${filePath}`));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\n✗ Failed to save response: ${error.message}`));
    }
  }
}

/**
 * Get color for status code
 */
function getStatusColor(status: number): typeof chalk.green {
  if (status >= 200 && status < 300) {
    return chalk.green;
  } else if (status >= 300 && status < 400) {
    return chalk.blue;
  } else if (status >= 400 && status < 500) {
    return chalk.yellow;
  } else {
    return chalk.red;
  }
}

/**
 * Display error message
 */
export function displayError(error: Error): void {
  console.error(chalk.red('\n✗ Error:'), error.message);
  if (error.stack) {
    console.error(chalk.gray(error.stack));
  }
}

/**
 * Display test results
 */
export function displayTestResults(testResults: import('../models').TestResult): void {
  console.log(chalk.bold('\n\nTest Results:'));
  console.log(
    chalk.bold('Status:'),
    testResults.passed ? chalk.green('✓ PASSED') : chalk.red('✗ FAILED')
  );
  console.log(chalk.bold('Duration:'), chalk.cyan(`${testResults.duration}ms`));
  console.log(
    chalk.bold('Tests:'),
    `${testResults.assertions.filter((a) => a.passed).length}/${testResults.assertions.length} passed`
  );

  console.log(chalk.bold('\nAssertions:'));
  testResults.assertions.forEach((assertion, index) => {
    const status = assertion.passed ? chalk.green('✓') : chalk.red('✗');
    console.log(`  ${index + 1}. ${status} ${assertion.name}`);

    if (!assertion.passed) {
      console.log(chalk.gray(`     Expected: ${JSON.stringify(assertion.expected)}`));
      console.log(chalk.gray(`     Actual:   ${JSON.stringify(assertion.actual)}`));
    }
  });

  console.log(''); // Empty line at the end
}
