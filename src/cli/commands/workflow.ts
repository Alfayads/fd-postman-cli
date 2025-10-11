/**
 * Workflow command - Sequential request execution
 */

import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import { WorkflowEngine } from '../../core/workflow-engine';
import { RequestExecutor } from '../../core/request-executor';
import { EnvironmentManager } from '../../core/environment-manager';
import { HistoryManager } from '../../core/history-manager';
import { TestRunner } from '../../core/test-runner';
import { EnvironmentStorage } from '../../storage/environment-storage';
import { HistoryStorage } from '../../storage/history-storage';
import { GlobalStorage } from '../../storage/global-storage';
import { FileSystem } from '../../storage/file-system';
import { Workflow } from '../../models';
import { logger } from '../../utils/logger';

// Initialize storage and managers
const fileSystem = new FileSystem();
const environmentStorage = new EnvironmentStorage(fileSystem);
const historyStorage = new HistoryStorage(fileSystem);
const globalStorage = new GlobalStorage(fileSystem);
const environmentManager = new EnvironmentManager();
const historyManager = new HistoryManager();
const testRunner = new TestRunner();
environmentManager.setStorage(environmentStorage);
historyManager.setStorage(historyStorage);
const requestExecutor = new RequestExecutor(environmentManager, historyManager, testRunner);
const workflowEngine = new WorkflowEngine(requestExecutor);

export function registerWorkflowCommand(program: Command): void {
  const workflowCmd = program
    .command('workflow')
    .alias('wf')
    .description('Execute workflow (sequential requests with variable capture)');

  // fp workflow run <file> - Execute a workflow from file
  workflowCmd
    .command('run <file>')
    .alias('execute')
    .description('Execute a workflow from JSON file')
    .option('-e, --env <name>', 'Environment to use')
    .option('--verbose', 'Show detailed execution logs')
    .action(async (file: string, options: { env?: string; verbose?: boolean }) => {
      try {
        if (!fs.existsSync(file)) {
          console.error(chalk.red(`\n✗ Workflow file not found: ${file}`));
          process.exit(1);
        }

        const content = fs.readFileSync(file, 'utf-8');
        const workflow = JSON.parse(content) as Workflow;

        // Validate workflow
        if (!workflow.name || !workflow.steps || workflow.steps.length === 0) {
          console.error(chalk.red('\n✗ Invalid workflow file'));
          console.log(chalk.gray('  Required: name, steps (array)'));
          process.exit(1);
        }

        // Get global variables
        const globalVars = globalStorage.getGlobalVariables();

        // Convert GlobalVariables to Record<string, string>
        const globalVarsRecord: Record<string, string> = {};
        Object.entries(globalVars.variables).forEach(([key, value]) => {
          globalVarsRecord[key] = value;
        });

        // Execute workflow
        const result = await workflowEngine.executeWorkflow(
          workflow,
          options.env,
          globalVarsRecord
        );

        // Exit with error code if workflow failed
        if (!result.success) {
          process.exit(1);
        }
      } catch (error) {
        logger.error('Failed to run workflow', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });

  // fp workflow create <name> - Create a new workflow file template
  workflowCmd
    .command('create <name>')
    .description('Create a new workflow template file')
    .option('-o, --output <file>', 'Output file path')
    .action((name: string, options: { output?: string }) => {
      try {
        const filename =
          options.output || `${name.replace(/\s+/g, '-').toLowerCase()}.workflow.json`;

        const template: Workflow = {
          name,
          description: 'Workflow description',
          environment: '',
          steps: [
            {
              name: 'Step 1: Get data',
              request: {
                method: 'GET',
                url: 'https://api.example.com/data',
                headers: {},
                params: {},
                body: undefined,
                tests: [],
              },
              extractVariables: [
                {
                  name: 'extractedId',
                  path: 'id',
                  scope: 'workflow',
                },
              ],
              continueOnError: false,
            },
            {
              name: 'Step 2: Use extracted data',
              request: {
                method: 'POST',
                url: 'https://api.example.com/items',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  id: '{{extractedId}}',
                  name: 'Item from workflow',
                },
                tests: [],
              },
              continueOnError: false,
            },
          ],
        };

        fs.writeFileSync(filename, JSON.stringify(template, null, 2), 'utf-8');

        console.log(chalk.green(`\n✓ Workflow template created`));
        console.log(chalk.gray(`  File: ${filename}`));
        console.log(chalk.gray(`  Steps: ${template.steps.length}`));
        console.log('');
        console.log(chalk.bold('Next steps:'));
        console.log(chalk.gray(`  1. Edit the workflow file: ${filename}`));
        console.log(chalk.gray(`  2. Run the workflow: fp workflow run ${filename}`));
        console.log('');
      } catch (error) {
        logger.error('Failed to create workflow template', error);
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });
}
