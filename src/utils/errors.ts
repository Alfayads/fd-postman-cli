/**
 * Centralized error handling routines
 */

import chalk from 'chalk';

export class CLIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CLIError';
  }
}

export class ValidationError extends CLIError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class StorageError extends CLIError {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class RequestError extends CLIError {
  constructor(message: string) {
    super(message);
    this.name = 'RequestError';
  }
}

/**
 * Handle and display errors
 */
export function handleError(error: unknown): void {
  if (error instanceof CLIError) {
    console.error(chalk.red(`\n✗ ${error.name}:`), error.message);
  } else if (error instanceof Error) {
    console.error(chalk.red('\n✗ Error:'), error.message);

    // Show stack trace in debug mode
    if (process.env.DEBUG) {
      console.error(chalk.gray(error.stack));
    }
  } else {
    console.error(chalk.red('\n✗ Unknown error:'), error);
  }
}
