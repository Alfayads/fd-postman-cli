/**
 * Import command - Import collections and environments
 */

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import { CollectionManager } from '../../core/collection-manager';
import { EnvironmentManager } from '../../core/environment-manager';
import { CollectionStorage } from '../../storage/collection-storage';
import { EnvironmentStorage } from '../../storage/environment-storage';
import { FileSystem } from '../../storage/file-system';
import { Collection, Environment } from '../../models';
import { logger } from '../../utils/logger';

// Initialize storage and managers
const fileSystem = new FileSystem();
const collectionStorage = new CollectionStorage(fileSystem);
const environmentStorage = new EnvironmentStorage(fileSystem);
const collectionManager = new CollectionManager();
const environmentManager = new EnvironmentManager();
collectionManager.setStorage(collectionStorage);
environmentManager.setStorage(environmentStorage);

export function registerImportCommand(program: Command): void {
  const importCmd = program.command('import').description('Import collections and environments');

  // fp import collection <file> - Import a collection
  importCmd
    .command('collection <file>')
    .description('Import a collection from JSON file')
    .option('--merge', 'Merge with existing collection if name matches')
    .action(async (file: string, options: { merge?: boolean }) => {
      try {
        if (!fs.existsSync(file)) {
          console.error(chalk.red(`\n✗ File not found: ${file}`));
          process.exit(1);
        }

        const content = fs.readFileSync(file, 'utf-8');
        const collection = JSON.parse(content) as Collection;

        // Check if collection already exists
        const existing = await collectionManager.getCollection(collection.name);

        if (existing && !options.merge) {
          console.error(chalk.red(`\n✗ Collection '${collection.name}' already exists`));
          console.log(chalk.gray('  Use --merge flag to merge with existing'));
          process.exit(1);
        }

        if (existing && options.merge) {
          // Merge with existing
          const merged = {
            ...existing,
            requests: [...existing.requests, ...collection.requests],
            updatedAt: new Date(),
          };
          await collectionManager.updateCollection(existing.id, merged);
          console.log(chalk.green(`\n✓ Collection merged successfully`));
          console.log(chalk.gray(`  Collection: ${collection.name}`));
          console.log(
            chalk.gray(
              `  Total Requests: ${merged.requests.length} (${existing.requests.length} + ${collection.requests.length})`
            )
          );
        } else {
          // Import as new collection
          // Generate new ID and update dates
          collection.id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          collection.createdAt = new Date();
          collection.updatedAt = new Date();

          await collectionStorage.save(collection);
          console.log(chalk.green(`\n✓ Collection imported successfully`));
          console.log(chalk.gray(`  Collection: ${collection.name}`));
          console.log(chalk.gray(`  Requests: ${collection.requests.length}`));
          console.log(chalk.gray(`  ID: ${collection.id}`));
        }

        console.log('');
      } catch (error) {
        logger.error('Failed to import collection', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp import env <file> - Import an environment
  importCmd
    .command('env <file>')
    .alias('environment')
    .description('Import an environment from JSON file')
    .option('--merge', 'Merge with existing environment if name matches')
    .action(async (file: string, options: { merge?: boolean }) => {
      try {
        if (!fs.existsSync(file)) {
          console.error(chalk.red(`\n✗ File not found: ${file}`));
          process.exit(1);
        }

        const content = fs.readFileSync(file, 'utf-8');
        const environment = JSON.parse(content) as Environment;

        // Check if environment already exists
        const existing = await environmentManager.getEnvironment(environment.name);

        if (existing && !options.merge) {
          console.error(chalk.red(`\n✗ Environment '${environment.name}' already exists`));
          console.log(chalk.gray('  Use --merge flag to merge with existing'));
          process.exit(1);
        }

        if (existing && options.merge) {
          // Merge with existing
          const merged = {
            ...existing,
            variables: { ...existing.variables, ...environment.variables },
            updatedAt: new Date(),
          };
          await environmentManager.updateEnvironment(existing.id, merged);
          console.log(chalk.green(`\n✓ Environment merged successfully`));
          console.log(chalk.gray(`  Environment: ${environment.name}`));
          console.log(chalk.gray(`  Total Variables: ${Object.keys(merged.variables).length}`));
        } else {
          // Import as new environment
          // Generate new ID and update dates
          environment.id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          environment.createdAt = new Date();
          environment.updatedAt = new Date();

          await environmentStorage.save(environment);
          console.log(chalk.green(`\n✓ Environment imported successfully`));
          console.log(chalk.gray(`  Environment: ${environment.name}`));
          console.log(chalk.gray(`  Variables: ${Object.keys(environment.variables).length}`));
          console.log(chalk.gray(`  ID: ${environment.id}`));
        }

        console.log('');
      } catch (error) {
        logger.error('Failed to import environment', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });
}
