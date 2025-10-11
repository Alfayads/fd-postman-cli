/**
 * OPTIONS command implementation
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { CommandOptions } from '../../models';
import { executeRequest } from '../handlers/request-handler';
import { validateUrl } from '../validators';

export function registerOptionsCommand(program: Command): void {
  program
    .command('options <url>')
    .description('Send an OPTIONS request to the specified URL')
    .option('-H, --header <headers...>', 'Add custom headers (format: "Key: Value")')
    .option('-q, --query <params...>', 'Add query parameters (format: "key=value")')
    .option('-o, --output <file>', 'Save response to file')
    .option('--timeout <ms>', 'Request timeout in milliseconds', '30000')
    .option('--env <name>', 'Use environment variables')
    .option('--insecure', 'Skip SSL certificate validation')
    .option('--no-follow-redirects', 'Do not follow redirects')
    .option('--max-redirects <number>', 'Maximum number of redirects to follow', '5')
    // Authentication options
    .option('--auth-type <type>', 'Authentication type (bearer, basic, apikey)')
    .option('--token <token>', 'Bearer token for authentication')
    .option('--username <username>', 'Username for basic authentication')
    .option('--password <password>', 'Password for basic authentication')
    .option('--api-key <key>', 'API key value')
    .option('--api-key-name <name>', 'API key header/query parameter name', 'X-API-Key')
    .option('--api-key-in <location>', 'API key location (header or query)', 'header')
    .action(async (url: string, options: CommandOptions) => {
      try {
        validateUrl(url);
        console.log(chalk.cyan('OPTIONS Request:'), url);
        await executeRequest('OPTIONS', url, options);
      } catch (error) {
        if (error instanceof Error) {
          console.error(chalk.red('\n✗ Error:'), error.message);
        }
        process.exit(1);
      }
    });
}
