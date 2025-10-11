/**
 * Export command - Export collections and environments
 */

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import { CollectionManager } from '../../core/collection-manager';
import { EnvironmentManager } from '../../core/environment-manager';
import { CollectionStorage } from '../../storage/collection-storage';
import { EnvironmentStorage } from '../../storage/environment-storage';
import { FileSystem } from '../../storage/file-system';
import { logger } from '../../utils/logger';

// Initialize storage and managers
const fileSystem = new FileSystem();
const collectionStorage = new CollectionStorage(fileSystem);
const environmentStorage = new EnvironmentStorage(fileSystem);
const collectionManager = new CollectionManager();
const environmentManager = new EnvironmentManager();
collectionManager.setStorage(collectionStorage);
environmentManager.setStorage(environmentStorage);

export function registerExportCommand(program: Command): void {
  const exportCmd = program.command('export').description('Export collections and environments');

  // fp export collection <name> - Export a collection
  exportCmd
    .command('collection <name>')
    .description('Export a collection to JSON file')
    .option('-o, --output <file>', 'Output file path', '<name>.collection.json')
    .action(async (name: string, options: { output: string }) => {
      try {
        const collection = await collectionManager.getCollection(name);

        if (!collection) {
          console.error(chalk.red(`\n✗ Collection '${name}' not found`));
          process.exit(1);
        }

        const outputFile =
          options.output === '<name>.collection.json'
            ? `${name.replace(/\s+/g, '-').toLowerCase()}.collection.json`
            : options.output;

        fs.writeFileSync(outputFile, JSON.stringify(collection, null, 2), 'utf-8');

        console.log(chalk.green(`\n✓ Collection exported successfully`));
        console.log(chalk.gray(`  Collection: ${collection.name}`));
        console.log(chalk.gray(`  Requests: ${collection.requests.length}`));
        console.log(chalk.gray(`  Output: ${outputFile}`));
        console.log('');
      } catch (error) {
        logger.error('Failed to export collection', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp export env <name> - Export an environment
  exportCmd
    .command('env <name>')
    .alias('environment')
    .description('Export an environment to JSON file')
    .option('-o, --output <file>', 'Output file path', '<name>.env.json')
    .action(async (name: string, options: { output: string }) => {
      try {
        const environment = await environmentManager.getEnvironment(name);

        if (!environment) {
          console.error(chalk.red(`\n✗ Environment '${name}' not found`));
          process.exit(1);
        }

        const outputFile =
          options.output === '<name>.env.json'
            ? `${name.replace(/\s+/g, '-').toLowerCase()}.env.json`
            : options.output;

        fs.writeFileSync(outputFile, JSON.stringify(environment, null, 2), 'utf-8');

        console.log(chalk.green(`\n✓ Environment exported successfully`));
        console.log(chalk.gray(`  Environment: ${environment.name}`));
        console.log(chalk.gray(`  Variables: ${Object.keys(environment.variables).length}`));
        console.log(chalk.gray(`  Output: ${outputFile}`));
        console.log('');
      } catch (error) {
        logger.error('Failed to export environment', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp export all - Export all collections and environments
  exportCmd
    .command('all')
    .description('Export all collections and environments')
    .option('-d, --directory <dir>', 'Output directory', './fd-postman-exports')
    .action(async (options: { directory: string }) => {
      try {
        const outputDir = options.directory;

        // Create output directory
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Export all collections
        const collections = await collectionManager.listCollections();
        const collectionsDir = `${outputDir}/collections`;
        if (!fs.existsSync(collectionsDir)) {
          fs.mkdirSync(collectionsDir, { recursive: true });
        }

        for (const collection of collections) {
          const filename = `${collection.name.replace(/\s+/g, '-').toLowerCase()}.collection.json`;
          const filepath = `${collectionsDir}/${filename}`;
          fs.writeFileSync(filepath, JSON.stringify(collection, null, 2), 'utf-8');
        }

        // Export all environments
        const environments = await environmentManager.listEnvironments();
        const environmentsDir = `${outputDir}/environments`;
        if (!fs.existsSync(environmentsDir)) {
          fs.mkdirSync(environmentsDir, { recursive: true });
        }

        for (const environment of environments) {
          const filename = `${environment.name.replace(/\s+/g, '-').toLowerCase()}.env.json`;
          const filepath = `${environmentsDir}/${filename}`;
          fs.writeFileSync(filepath, JSON.stringify(environment, null, 2), 'utf-8');
        }

        console.log(chalk.green('\n✓ Export completed successfully'));
        console.log(chalk.gray(`  Output Directory: ${outputDir}`));
        console.log(chalk.gray(`  Collections: ${collections.length}`));
        console.log(chalk.gray(`  Environments: ${environments.length}`));
        console.log('');
      } catch (error) {
        logger.error('Failed to export all', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });
}
