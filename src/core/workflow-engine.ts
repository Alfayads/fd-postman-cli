/**
 * Workflow Engine - Sequential request execution with variable capture
 */

import { Workflow, WorkflowStep, ResponseData } from '../models';
import { RequestExecutor } from './request-executor';
import { extractJsonPath } from '../utils/json-path';
import { logger } from '../utils/logger';
import chalk from 'chalk';

export interface WorkflowRunResult {
  workflowName: string;
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  steps: StepRunResult[];
  totalDuration: number;
  success: boolean;
}

export interface StepRunResult {
  step: WorkflowStep;
  response?: ResponseData;
  error?: string;
  success: boolean;
  capturedVariables?: Record<string, string>;
}

export class WorkflowEngine {
  private requestExecutor: RequestExecutor;
  private workflowVariables: Map<string, string> = new Map();

  constructor(requestExecutor: RequestExecutor) {
    this.requestExecutor = requestExecutor;
  }

  /**
   * Execute a workflow (sequence of requests)
   */
  async executeWorkflow(
    workflow: Workflow,
    environmentName?: string,
    globalVariables?: Record<string, string>
  ): Promise<WorkflowRunResult> {
    const startTime = Date.now();
    const results: StepRunResult[] = [];
    let completedSteps = 0;
    let failedSteps = 0;

    console.log(chalk.bold(`\n▶ Running Workflow: ${chalk.cyan(workflow.name)}`));
    console.log(chalk.gray(`  Steps: ${workflow.steps.length}`));
    if (environmentName) {
      console.log(chalk.gray(`  Environment: ${environmentName}`));
    }
    console.log('');

    // Clear workflow variables for new run
    this.workflowVariables.clear();

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      if (!step) continue;

      console.log(chalk.gray(`[${i + 1}/${workflow.steps.length}]`), chalk.cyan(`${step.name}`));

      try {
        const result = await this.executeStep(step, workflow, environmentName, globalVariables);

        results.push(result);

        if (result.success) {
          completedSteps++;
          console.log(
            chalk.green(
              `  ✓ ${result.response?.status} ${result.response?.statusText} (${result.response?.duration}ms)`
            )
          );

          // Show captured variables
          if (result.capturedVariables && Object.keys(result.capturedVariables).length > 0) {
            console.log(
              chalk.yellow(
                `  📌 Captured ${Object.keys(result.capturedVariables).length} variable(s)`
              )
            );
            Object.entries(result.capturedVariables).forEach(([key, value]) => {
              console.log(chalk.gray(`     ${key}: ${value.substring(0, 50)}...`));
            });
          }
        } else {
          failedSteps++;
          console.log(chalk.red(`  ✗ ${result.error || 'Step failed'}`));

          // Stop on error if continueOnError is false
          if (!step.continueOnError) {
            console.log(chalk.yellow('\n  ⚠ Workflow stopped due to error'));
            break;
          }
        }

        console.log('');
      } catch (error) {
        failedSteps++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          step,
          success: false,
          error: errorMessage,
        });
        console.log(chalk.red(`  ✗ Error: ${errorMessage}`));
        console.log('');

        if (!step.continueOnError) {
          break;
        }
      }
    }

    const totalDuration = Date.now() - startTime;
    const success = failedSteps === 0;

    // Summary
    console.log(chalk.bold('═'.repeat(70)));
    console.log(chalk.bold('Workflow Summary:'));
    console.log(chalk.gray(`  Workflow: ${workflow.name}`));
    console.log(chalk.gray(`  Total Steps: ${workflow.steps.length}`));
    console.log(chalk.green(`  Completed: ${completedSteps}`));
    if (failedSteps > 0) {
      console.log(chalk.red(`  Failed: ${failedSteps}`));
    }
    console.log(chalk.gray(`  Total Duration: ${totalDuration}ms`));
    console.log(
      chalk.bold('  Status: '),
      success ? chalk.green('✓ SUCCESS') : chalk.red('✗ FAILED')
    );
    console.log(chalk.bold('═'.repeat(70)));
    console.log('');

    return {
      workflowName: workflow.name,
      totalSteps: workflow.steps.length,
      completedSteps,
      failedSteps,
      steps: results,
      totalDuration,
      success,
    };
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(
    step: WorkflowStep,
    workflow: Workflow,
    environmentName?: string,
    globalVariables?: Record<string, string>
  ): Promise<StepRunResult> {
    try {
      // Build request URL
      const url = step.request.url;

      // Prepare workflow variables as local scope
      const workflowVars: Record<string, string> = {};
      this.workflowVariables.forEach((value, key) => {
        workflowVars[key] = value;
      });

      // Execute request with workflow variables as local scope
      const { response, testResults } = await this.requestExecutor.executeRequest(
        {
          method: step.request.method as
            | 'GET'
            | 'POST'
            | 'PUT'
            | 'DELETE'
            | 'PATCH'
            | 'HEAD'
            | 'OPTIONS',
          url,
          headers: step.request.headers,
          params: step.request.params,
          data: step.request.body,
        },
        environmentName || workflow.environment,
        step.request.tests,
        globalVariables,
        undefined, // Collection variables (not applicable here)
        workflowVars // Workflow variables as local scope
      );

      // Extract and capture variables from response
      const capturedVariables: Record<string, string> = {};
      if (step.extractVariables && step.extractVariables.length > 0) {
        for (const extraction of step.extractVariables) {
          const extractedValue = extractJsonPath(response.data, extraction.path);

          if (extractedValue !== undefined) {
            const stringValue = String(extractedValue);
            capturedVariables[extraction.name] = stringValue;

            // Store in appropriate scope
            if (extraction.scope === 'workflow') {
              this.workflowVariables.set(extraction.name, stringValue);
            }
            // TODO: Store in environment scope if specified
          } else {
            logger.warn(
              `Failed to extract variable '${extraction.name}' from path '${extraction.path}'`
            );
          }
        }
      }

      // Check if tests passed (if any)
      const success =
        response.status >= 200 && response.status < 400 && (!testResults || testResults.passed);

      return {
        step,
        response,
        success,
        capturedVariables,
      };
    } catch (error) {
      logger.error('Step execution failed', { step: step.name, error });
      return {
        step,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get captured workflow variables
   */
  getWorkflowVariables(): Record<string, string> {
    const vars: Record<string, string> = {};
    this.workflowVariables.forEach((value, key) => {
      vars[key] = value;
    });
    return vars;
  }

  /**
   * Clear workflow variables
   */
  clearWorkflowVariables(): void {
    this.workflowVariables.clear();
  }
}
