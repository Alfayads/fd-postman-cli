/**
 * Environment management commands
 * Handles: fp env set, list, use, delete, show
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { EnvironmentManager } from '../../core/environment-manager';
import { EnvironmentStorage } from '../../storage/environment-storage';
import { FileSystem } from '../../storage/file-system';
import { GlobalStorage } from '../../storage/global-storage';
import { logger } from '../../utils/logger';

// Initialize storage and manager
const fileSystem = new FileSystem();
const environmentStorage = new EnvironmentStorage(fileSystem);
const globalStorage = new GlobalStorage(fileSystem);
const environmentManager = new EnvironmentManager();
environmentManager.setStorage(environmentStorage);

export function registerEnvCommand(program: Command): void {
  const envCommand = program.command('env').description('Manage environments and variables');

  // fp env list - List all environments
  envCommand
    .command('list')
    .alias('ls')
    .description('List all environments')
    .action(async () => {
      try {
        const environments = await environmentManager.listEnvironments();

        if (environments.length === 0) {
          console.log(chalk.yellow('No environments found.'));
          console.log(chalk.gray('Create one with: fp env set <name> <key=value>'));
          return;
        }

        console.log(chalk.bold('\nEnvironments:'));
        environments.forEach((env) => {
          console.log(chalk.cyan(`\n  ${env.name}`));
          console.log(chalk.gray(`    ID: ${env.id}`));
          console.log(chalk.gray(`    Variables: ${Object.keys(env.variables).length}`));
          console.log(chalk.gray(`    Created: ${env.createdAt.toLocaleDateString()}`));
        });
        console.log('');
      } catch (error) {
        logger.error('Failed to list environments', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp env set <name> <key=value...> - Create or update environment
  envCommand
    .command('set <name> [variables...]')
    .description('Create or update an environment with variables (format: key=value)')
    .action(async (name: string, variables: string[]) => {
      try {
        // Parse variables
        const parsedVariables: Record<string, string> = {};
        for (const variable of variables) {
          const index = variable.indexOf('=');
          if (index === -1) {
            console.error(chalk.red(`\n✗ Invalid variable format: ${variable}`));
            console.error(chalk.gray('Expected format: key=value'));
            process.exit(1);
          }
          const key = variable.substring(0, index).trim();
          const value = variable.substring(index + 1).trim();
          parsedVariables[key] = value;
        }

        // Check if environment exists
        const existing = await environmentManager.getEnvironment(name);

        if (existing) {
          // Update existing environment
          const updated = await environmentManager.updateEnvironment(existing.id, {
            variables: { ...existing.variables, ...parsedVariables },
            updatedAt: new Date(),
          });
          console.log(chalk.green(`\n✓ Environment '${name}' updated`));
          console.log(chalk.gray(`  Variables: ${Object.keys(updated.variables).length}`));
        } else {
          // Create new environment
          const environment = await environmentManager.createEnvironment(name, parsedVariables);
          console.log(chalk.green(`\n✓ Environment '${name}' created`));
          console.log(chalk.gray(`  ID: ${environment.id}`));
          console.log(chalk.gray(`  Variables: ${Object.keys(environment.variables).length}`));
        }

        console.log('');
      } catch (error) {
        logger.error('Failed to set environment', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp env show <name> - Show environment details
  envCommand
    .command('show <name>')
    .description('Show environment variables')
    .action(async (name: string) => {
      try {
        const environment = await environmentManager.getEnvironment(name);

        if (!environment) {
          console.error(chalk.red(`\n✗ Environment '${name}' not found`));
          process.exit(1);
        }

        console.log(chalk.bold(`\nEnvironment: ${environment.name}`));
        console.log(chalk.gray(`ID: ${environment.id}`));
        console.log(chalk.gray(`Created: ${environment.createdAt.toLocaleDateString()}`));
        console.log(chalk.gray(`Updated: ${environment.updatedAt.toLocaleDateString()}`));

        console.log(chalk.bold('\nVariables:'));
        if (Object.keys(environment.variables).length === 0) {
          console.log(chalk.gray('  (no variables)'));
        } else {
          Object.entries(environment.variables).forEach(([key, value]) => {
            console.log(chalk.cyan(`  ${key}:`), value);
          });
        }
        console.log('');
      } catch (error) {
        logger.error('Failed to show environment', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp env delete <name> - Delete an environment
  envCommand
    .command('delete <name>')
    .alias('rm')
    .description('Delete an environment')
    .action(async (name: string) => {
      try {
        const environment = await environmentManager.getEnvironment(name);

        if (!environment) {
          console.error(chalk.red(`\n✗ Environment '${name}' not found`));
          process.exit(1);
        }

        await environmentManager.deleteEnvironment(environment.id);
        console.log(chalk.green(`\n✓ Environment '${name}' deleted`));
        console.log('');
      } catch (error) {
        logger.error('Failed to delete environment', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp env unset <name> <key...> - Remove variables from environment
  envCommand
    .command('unset <name> <keys...>')
    .description('Remove variables from an environment')
    .action(async (name: string, keys: string[]) => {
      try {
        const environment = await environmentManager.getEnvironment(name);

        if (!environment) {
          console.error(chalk.red(`\n✗ Environment '${name}' not found`));
          process.exit(1);
        }

        const updatedVariables = { ...environment.variables };
        keys.forEach((key) => {
          delete updatedVariables[key];
        });

        await environmentManager.updateEnvironment(environment.id, {
          variables: updatedVariables,
          updatedAt: new Date(),
        });

        console.log(chalk.green(`\n✓ Removed ${keys.length} variable(s) from '${name}'`));
        console.log('');
      } catch (error) {
        logger.error('Failed to unset variables', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp env use <name> - Set active environment
  envCommand
    .command('use <name>')
    .description('Set active environment for all requests')
    .action(async (name: string) => {
      try {
        const environment = await environmentManager.getEnvironment(name);

        if (!environment) {
          console.error(chalk.red(`\n✗ Environment '${name}' not found`));
          process.exit(1);
        }

        const active = globalStorage.setActiveEnvironment(environment.name, environment.id);
        console.log(chalk.green(`\n✓ Active environment set to '${name}'`));
        console.log(chalk.gray(`  Activated at: ${active.activatedAt.toLocaleString()}`));
        console.log(
          chalk.gray('  All requests will use this environment unless overridden with --env')
        );
        console.log('');
      } catch (error) {
        logger.error('Failed to set active environment', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp env active - Show active environment
  envCommand
    .command('active')
    .description('Show currently active environment')
    .action(() => {
      try {
        const active = globalStorage.getActiveEnvironment();

        if (!active) {
          console.log(chalk.yellow('No active environment set.'));
          console.log(chalk.gray('Set one with: fp env use <name>'));
          return;
        }

        console.log(chalk.bold('\nActive Environment:'));
        console.log(chalk.cyan(`  ${active.name}`));
        console.log(chalk.gray(`  ID: ${active.environmentId}`));
        console.log(chalk.gray(`  Activated: ${active.activatedAt.toLocaleString()}`));
        console.log('');
      } catch (error) {
        logger.error('Failed to show active environment', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp env unuse - Clear active environment
  envCommand
    .command('unuse')
    .description('Clear active environment')
    .action(() => {
      try {
        globalStorage.clearActiveEnvironment();
        console.log(chalk.green('\n✓ Active environment cleared'));
        console.log('');
      } catch (error) {
        logger.error('Failed to clear active environment', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });
}
