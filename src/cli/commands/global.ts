/**
 * Global variables management commands
 * Handles: fp global set, list, unset, clear
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { GlobalStorage } from '../../storage/global-storage';
import { FileSystem } from '../../storage/file-system';
import { logger } from '../../utils/logger';

// Initialize storage
const fileSystem = new FileSystem();
const globalStorage = new GlobalStorage(fileSystem);

export function registerGlobalCommand(program: Command): void {
  const globalCmd = program.command('global').description('Manage global variables');

  // fp global list - List all global variables
  globalCmd
    .command('list')
    .alias('ls')
    .description('List all global variables')
    .action(() => {
      try {
        const globals = globalStorage.getGlobalVariables();

        if (Object.keys(globals.variables).length === 0) {
          console.log(chalk.yellow('No global variables found.'));
          console.log(chalk.gray('Create one with: fp global set <key=value>'));
          return;
        }

        console.log(chalk.bold('\nGlobal Variables:'));
        console.log(chalk.gray(`Updated: ${globals.updatedAt.toLocaleDateString()}`));
        console.log('');

        Object.entries(globals.variables).forEach(([key, value]) => {
          console.log(chalk.cyan(`  ${key}:`), value);
        });
        console.log('');
      } catch (error) {
        logger.error('Failed to list global variables', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp global set <key=value...> - Set global variables
  globalCmd
    .command('set <variables...>')
    .description('Set global variables (format: key=value)')
    .action((variables: string[]) => {
      try {
        const parsed: Record<string, string> = {};
        for (const variable of variables) {
          const index = variable.indexOf('=');
          if (index === -1) {
            console.error(chalk.red(`\n✗ Invalid variable format: ${variable}`));
            console.error(chalk.gray('Expected format: key=value'));
            process.exit(1);
          }
          const key = variable.substring(0, index).trim();
          const value = variable.substring(index + 1).trim();
          parsed[key] = value;
        }

        const updated = globalStorage.updateGlobalVariables(parsed);
        console.log(chalk.green(`\n✓ Updated ${Object.keys(parsed).length} global variable(s)`));
        console.log(chalk.gray(`  Total variables: ${Object.keys(updated.variables).length}`));
        console.log('');
      } catch (error) {
        logger.error('Failed to set global variables', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp global unset <keys...> - Remove global variables
  globalCmd
    .command('unset <keys...>')
    .description('Remove global variables')
    .action((keys: string[]) => {
      try {
        const updated = globalStorage.deleteGlobalVariables(keys);
        console.log(chalk.green(`\n✓ Removed ${keys.length} global variable(s)`));
        console.log(chalk.gray(`  Remaining variables: ${Object.keys(updated.variables).length}`));
        console.log('');
      } catch (error) {
        logger.error('Failed to unset global variables', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp global clear - Clear all global variables
  globalCmd
    .command('clear')
    .description('Clear all global variables')
    .action(() => {
      try {
        globalStorage.clearGlobalVariables();
        console.log(chalk.green('\n✓ All global variables cleared'));
        console.log('');
      } catch (error) {
        logger.error('Failed to clear global variables', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });
}
