/**
 * Collection management commands
 * Handles: fp collection create, list, show, delete, run
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { CollectionManager } from '../../core/collection-manager';
import { CollectionRunner } from '../../core/collection-runner';
import { RequestExecutor } from '../../core/request-executor';
import { EnvironmentManager } from '../../core/environment-manager';
import { HistoryManager } from '../../core/history-manager';
import { TestRunner } from '../../core/test-runner';
import { CollectionStorage } from '../../storage/collection-storage';
import { EnvironmentStorage } from '../../storage/environment-storage';
import { HistoryStorage } from '../../storage/history-storage';
import { GlobalStorage } from '../../storage/global-storage';
import { FileSystem } from '../../storage/file-system';
import { logger } from '../../utils/logger';

// Initialize storage and managers
const fileSystem = new FileSystem();
const collectionStorage = new CollectionStorage(fileSystem);
const environmentStorage = new EnvironmentStorage(fileSystem);
const historyStorage = new HistoryStorage(fileSystem);
const globalStorage = new GlobalStorage(fileSystem);

const collectionManager = new CollectionManager();
const environmentManager = new EnvironmentManager();
const historyManager = new HistoryManager();
const testRunner = new TestRunner();

// Wire up dependencies
collectionManager.setStorage(collectionStorage);
environmentManager.setStorage(environmentStorage);
historyManager.setStorage(historyStorage);

const requestExecutor = new RequestExecutor(environmentManager, historyManager, testRunner);
const collectionRunner = new CollectionRunner(requestExecutor);

export function registerCollectionCommand(program: Command): void {
  const collectionCmd = program
    .command('collection')
    .alias('col')
    .description('Manage request collections');

  // fp collection list - List all collections
  collectionCmd
    .command('list')
    .alias('ls')
    .description('List all collections')
    .action(async () => {
      try {
        const collections = await collectionManager.listCollections();

        if (collections.length === 0) {
          console.log(chalk.yellow('No collections found.'));
          console.log(chalk.gray('Create one with: fp collection create <name>'));
          return;
        }

        console.log(chalk.bold('\nCollections:'));
        collections.forEach((col) => {
          console.log(chalk.cyan(`\n  ${col.name}`));
          console.log(chalk.gray(`    ID: ${col.id}`));
          if (col.description) {
            console.log(chalk.gray(`    Description: ${col.description}`));
          }
          console.log(chalk.gray(`    Requests: ${col.requests.length}`));
          console.log(chalk.gray(`    Created: ${col.createdAt.toLocaleDateString()}`));
        });
        console.log('');
      } catch (error) {
        logger.error('Failed to list collections', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp collection create <name> - Create a new collection
  collectionCmd
    .command('create <name>')
    .description('Create a new collection')
    .option('-d, --description <desc>', 'Collection description')
    .action(async (name: string, options: { description?: string }) => {
      try {
        const collection = await collectionManager.createCollection(name, options.description);

        console.log(chalk.green(`\n✓ Collection '${name}' created`));
        console.log(chalk.gray(`  ID: ${collection.id}`));
        if (collection.description) {
          console.log(chalk.gray(`  Description: ${collection.description}`));
        }
        console.log('');
      } catch (error) {
        logger.error('Failed to create collection', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp collection show <name> - Show collection details
  collectionCmd
    .command('show <name>')
    .description('Show collection details and requests')
    .action(async (name: string) => {
      try {
        const collection = await collectionManager.getCollection(name);

        if (!collection) {
          console.error(chalk.red(`\n✗ Collection '${name}' not found`));
          process.exit(1);
        }

        console.log(chalk.bold(`\nCollection: ${collection.name}`));
        console.log(chalk.gray(`ID: ${collection.id}`));
        if (collection.description) {
          console.log(chalk.gray(`Description: ${collection.description}`));
        }
        console.log(chalk.gray(`Created: ${collection.createdAt.toLocaleDateString()}`));
        console.log(chalk.gray(`Updated: ${collection.updatedAt.toLocaleDateString()}`));

        console.log(chalk.bold(`\nRequests (${collection.requests.length}):`));
        if (collection.requests.length === 0) {
          console.log(chalk.gray('  (no requests)'));
        } else {
          collection.requests.forEach((req, index) => {
            console.log(chalk.cyan(`\n  ${index + 1}. ${req.name}`));
            console.log(chalk.gray(`     ${req.method} ${req.url}`));
            if (req.tests && req.tests.length > 0) {
              console.log(chalk.gray(`     Tests: ${req.tests.length}`));
            }
          });
        }
        console.log('');
      } catch (error) {
        logger.error('Failed to show collection', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp collection delete <name> - Delete a collection
  collectionCmd
    .command('delete <name>')
    .alias('rm')
    .description('Delete a collection')
    .action(async (name: string) => {
      try {
        const collection = await collectionManager.getCollection(name);

        if (!collection) {
          console.error(chalk.red(`\n✗ Collection '${name}' not found`));
          process.exit(1);
        }

        await collectionManager.deleteCollection(collection.id);
        console.log(chalk.green(`\n✓ Collection '${name}' deleted`));
        console.log('');
      } catch (error) {
        logger.error('Failed to delete collection', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp collection run <name> - Run all requests in a collection
  collectionCmd
    .command('run <name>')
    .description('Run all requests in a collection')
    .option('--env <name>', 'Use specific environment')
    .option('--bail', 'Stop on first failure')
    .action(async (name: string, options: { env?: string; bail?: boolean }) => {
      try {
        const collection = await collectionManager.getCollection(name);

        if (!collection) {
          console.error(chalk.red(`\n✗ Collection '${name}' not found`));
          process.exit(1);
        }

        if (collection.requests.length === 0) {
          console.log(chalk.yellow(`\nCollection '${name}' has no requests to run`));
          return;
        }

        // Determine environment
        let environmentName = options.env;
        if (!environmentName) {
          const activeEnv = globalStorage.getActiveEnvironment();
          if (activeEnv) {
            environmentName = activeEnv.name;
          }
        }

        // Get global variables
        const globalVars = globalStorage.getGlobalVariables();

        // Run the collection
        const result = await collectionRunner.runCollection(
          collection,
          environmentName,
          globalVars.variables
        );

        // Exit with appropriate code
        if (result.failedRequests > 0) {
          process.exit(1);
        }
      } catch (error) {
        logger.error('Failed to run collection', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });
}
