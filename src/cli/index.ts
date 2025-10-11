#!/usr/bin/env node

/**
 * CLI Entry Point
 * Orchestrates command-line argument parsing and command execution
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../../package.json';
import { showWelcome } from './welcome';

// Import HTTP method commands
import { registerGetCommand } from './commands/get';
import { registerPostCommand } from './commands/post';
import { registerPutCommand } from './commands/put';
import { registerDeleteCommand } from './commands/delete';
import { registerPatchCommand } from './commands/patch';
import { registerHeadCommand } from './commands/head';
import { registerOptionsCommand } from './commands/options';

// Import management commands
import { registerEnvCommand } from './commands/env';
import { registerCollectionCommand } from './commands/collection';
import { registerHistoryCommand } from './commands/history';
import { registerGlobalCommand } from './commands/global';
import { registerExportCommand } from './commands/export';
import { registerImportCommand } from './commands/import';
import { registerWorkflowCommand } from './commands/workflow';
import { authCommand } from './commands/auth';

const program = new Command();

// Configure main program
program
  .name('fp')
  .description('fd-postman-cli - A powerful CLI tool for API testing')
  .version(version, '-v, --version', 'Output the current version');

// Register HTTP method commands
registerGetCommand(program);
registerPostCommand(program);
registerPutCommand(program);
registerDeleteCommand(program);
registerPatchCommand(program);
registerHeadCommand(program);
registerOptionsCommand(program);

// Register management commands
registerEnvCommand(program);
registerCollectionCommand(program);
registerHistoryCommand(program);
registerGlobalCommand(program);
registerExportCommand(program);
registerImportCommand(program);
registerWorkflowCommand(program);
program.addCommand(authCommand);

// Show welcome message if no arguments provided (before parsing)
if (!process.argv.slice(2).length) {
  void (async (): Promise<void> => {
    try {
      await showWelcome();
      process.exit(0);
    } catch (error) {
      console.error('Error showing welcome:', error);
      process.exit(1);
    }
  })();
} else {
  // Error handling for invalid commands
  program.on('command:*', () => {
    console.error(chalk.red('Invalid command:'), program.args.join(' '));
    console.log(
      chalk.yellow('Run'),
      chalk.cyan('fp --help'),
      chalk.yellow('for available commands')
    );
    process.exit(1);
  });

  // Parse command line arguments
  program.parse(process.argv);
}
