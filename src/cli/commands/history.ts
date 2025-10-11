/**
 * History management commands
 * Handles: fp history list, show, clear, search
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { HistoryManager } from '../../core/history-manager';
import { HistoryStorage } from '../../storage/history-storage';
import { FileSystem } from '../../storage/file-system';
import { logger } from '../../utils/logger';

// Initialize storage and manager
const fileSystem = new FileSystem();
const historyStorage = new HistoryStorage(fileSystem);
const historyManager = new HistoryManager();
historyManager.setStorage(historyStorage);

export function registerHistoryCommand(program: Command): void {
  const historyCmd = program.command('history').description('Manage request history');

  // fp history list - List recent requests
  historyCmd
    .command('list')
    .alias('ls')
    .description('List recent request history')
    .option('-l, --limit <number>', 'Number of entries to show', '10')
    .action(async (options: { limit: string }) => {
      try {
        const limit = parseInt(options.limit, 10);
        if (isNaN(limit) || limit <= 0) {
          console.error(chalk.red('\n✗ Invalid limit value'));
          process.exit(1);
        }

        const entries = await historyManager.listEntries(limit);

        if (entries.length === 0) {
          console.log(chalk.yellow('No history found.'));
          return;
        }

        console.log(chalk.bold(`\nRequest History (last ${entries.length}):`));
        entries.forEach((entry, index) => {
          const statusColor =
            entry.response.status >= 200 && entry.response.status < 300
              ? chalk.green
              : entry.response.status >= 400
                ? chalk.red
                : chalk.yellow;

          console.log(chalk.gray(`\n  ${index + 1}. ${entry.timestamp.toLocaleString()}`));
          console.log(`     ${chalk.cyan(entry.request.method)} ${entry.request.url}`);
          console.log(
            `     Status: ${statusColor(entry.response.status)} • Duration: ${entry.response.duration}ms`
          );
          console.log(chalk.gray(`     ID: ${entry.id}`));
        });
        console.log('');
      } catch (error) {
        logger.error('Failed to list history', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp history show <id> - Show detailed history entry
  historyCmd
    .command('show <id>')
    .description('Show detailed history entry')
    .action(async (id: string) => {
      try {
        const entry = await historyManager.getEntry(id);

        if (!entry) {
          console.error(chalk.red(`\n✗ History entry '${id}' not found`));
          process.exit(1);
        }

        console.log(chalk.bold('\nRequest:'));
        console.log(chalk.cyan(`  ${entry.request.method} ${entry.request.url}`));
        console.log(chalk.gray(`  Timestamp: ${entry.timestamp.toLocaleString()}`));

        if (entry.request.headers && Object.keys(entry.request.headers).length > 0) {
          console.log(chalk.bold('\n  Headers:'));
          Object.entries(entry.request.headers).forEach(([key, value]) => {
            console.log(chalk.gray(`    ${key}: ${value}`));
          });
        }

        if (entry.request.params && Object.keys(entry.request.params).length > 0) {
          console.log(chalk.bold('\n  Query Parameters:'));
          Object.entries(entry.request.params).forEach(([key, value]) => {
            console.log(chalk.gray(`    ${key}: ${value}`));
          });
        }

        if (entry.request.data) {
          console.log(chalk.bold('\n  Body:'));
          console.log(
            typeof entry.request.data === 'object'
              ? JSON.stringify(entry.request.data, null, 2)
              : entry.request.data
          );
        }

        const statusColor =
          entry.response.status >= 200 && entry.response.status < 300
            ? chalk.green
            : entry.response.status >= 400
              ? chalk.red
              : chalk.yellow;

        console.log(chalk.bold('\nResponse:'));
        console.log(
          `  Status: ${statusColor(entry.response.status + ' ' + entry.response.statusText)}`
        );
        console.log(chalk.gray(`  Duration: ${entry.response.duration}ms`));

        if (entry.response.headers && Object.keys(entry.response.headers).length > 0) {
          console.log(chalk.bold('\n  Headers:'));
          Object.entries(entry.response.headers).forEach(([key, value]) => {
            console.log(chalk.gray(`    ${key}: ${value}`));
          });
        }

        console.log(chalk.bold('\n  Body:'));
        console.log(
          typeof entry.response.data === 'object'
            ? JSON.stringify(entry.response.data, null, 2)
            : entry.response.data
        );

        console.log('');
      } catch (error) {
        logger.error('Failed to show history entry', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp history clear - Clear all history
  historyCmd
    .command('clear')
    .description('Clear all request history')
    .action(async () => {
      try {
        await historyManager.clearHistory();
        console.log(chalk.green('\n✓ History cleared'));
        console.log('');
      } catch (error) {
        logger.error('Failed to clear history', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp history search <query> - Search history
  historyCmd
    .command('search <query>')
    .description('Search request history')
    .action(async (query: string) => {
      try {
        const entries = await historyManager.searchEntries(query);

        if (entries.length === 0) {
          console.log(chalk.yellow(`No results found for '${query}'`));
          return;
        }

        console.log(chalk.bold(`\nSearch Results (${entries.length}):`));
        entries.forEach((entry, index) => {
          const statusColor =
            entry.response.status >= 200 && entry.response.status < 300
              ? chalk.green
              : entry.response.status >= 400
                ? chalk.red
                : chalk.yellow;

          console.log(chalk.gray(`\n  ${index + 1}. ${entry.timestamp.toLocaleString()}`));
          console.log(`     ${chalk.cyan(entry.request.method)} ${entry.request.url}`);
          console.log(
            `     Status: ${statusColor(entry.response.status)} • Duration: ${entry.response.duration}ms`
          );
          console.log(chalk.gray(`     ID: ${entry.id}`));
        });
        console.log('');
      } catch (error) {
        logger.error('Failed to search history', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp history replay <id> - Replay a request from history
  historyCmd
    .command('replay <id>')
    .alias('rerun')
    .description('Replay a request from history')
    .action(async (id: string) => {
      try {
        const entry = await historyManager.getEntry(id);

        if (!entry) {
          console.error(chalk.red(`\n✗ History entry '${id}' not found`));
          process.exit(1);
        }

        console.log(chalk.bold('\nReplaying Request:'));
        console.log(chalk.cyan(`  ${entry.request.method} ${entry.request.url}`));
        console.log(chalk.gray(`  Original: ${entry.timestamp.toLocaleString()}`));
        console.log('');

        // Re-execute the request
        const { makeRequest } = await import('../../core/http-client');
        const response = await makeRequest(entry.request);

        // Display the new response
        const { formatResponse } = await import('../../utils/formatter');
        formatResponse(response);

        console.log(chalk.green('\n✓ Request replayed successfully'));
        console.log('');
      } catch (error) {
        logger.error('Failed to replay request', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });
}
