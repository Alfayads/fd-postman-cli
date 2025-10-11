/**
 * Authentication management commands
 * Handles OAuth 2.0, AWS SigV4, and other advanced authentication methods
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../../utils/logger';
import {
  buildAuthorizationUrl,
  getClientCredentialsToken,
  exchangeCodeForToken,
  generatePKCE,
} from '../../utils/auth-oauth2';
import { OAuth2Config } from '../../models';

export const authCommand = new Command('auth')
  .description('Manage authentication configurations');

/**
 * OAuth 2.0: Generate authorization URL for Authorization Code or PKCE flow
 */
authCommand
  .command('oauth2-url')
  .description('Generate OAuth 2.0 authorization URL')
  .requiredOption('--client-id <id>', 'OAuth 2.0 client ID')
  .requiredOption('--auth-url <url>', 'Authorization endpoint URL')
  .option('--redirect-uri <uri>', 'Redirect URI', 'http://localhost:8080/callback')
  .option('--scope <scope>', 'Requested scope(s)')
  .option('--pkce', 'Use PKCE (Proof Key for Code Exchange)', false)
  .action(async (options) => {
    try {
      const config: OAuth2Config = {
        grantType: options.pkce ? 'pkce' : 'authorization_code',
        clientId: options.clientId,
        authUrl: options.authUrl,
        redirectUri: options.redirectUri,
        scope: options.scope,
      };

      if (options.pkce) {
        const { codeVerifier, codeChallenge } = generatePKCE();
        config.codeVerifier = codeVerifier;
        config.codeChallenge = codeChallenge;
        config.codeChallengeMethod = 'S256';

        console.log(chalk.yellow('\n📝 Save this code verifier for token exchange:'));
        console.log(chalk.cyan(`   Code Verifier: ${codeVerifier}\n`));
      }

      const authUrl = buildAuthorizationUrl(config);

      console.log(chalk.green('\n✅ Authorization URL generated!\n'));
      console.log(chalk.blue('🔗 Open this URL in your browser:\n'));
      console.log(chalk.cyan(authUrl));
      console.log(
        chalk.yellow(
          '\n💡 After authorization, copy the authorization code from the redirect URL.\n'
        )
      );
    } catch (error) {
      logger.error('Failed to generate authorization URL', error);
      throw error;
    }
  });

/**
 * OAuth 2.0: Exchange authorization code for access token
 */
authCommand
  .command('oauth2-token')
  .description('Exchange authorization code for access token')
  .requiredOption('--client-id <id>', 'OAuth 2.0 client ID')
  .requiredOption('--token-url <url>', 'Token endpoint URL')
  .requiredOption('--code <code>', 'Authorization code from redirect')
  .option('--client-secret <secret>', 'Client secret (not needed for PKCE)')
  .option('--redirect-uri <uri>', 'Redirect URI', 'http://localhost:8080/callback')
  .option('--code-verifier <verifier>', 'PKCE code verifier')
  .action(async (options) => {
    try {
      const config: OAuth2Config = {
        grantType: options.codeVerifier ? 'pkce' : 'authorization_code',
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        tokenUrl: options.tokenUrl,
        redirectUri: options.redirectUri,
        codeVerifier: options.codeVerifier,
      };

      const result = await exchangeCodeForToken(config, options.code);

      console.log(chalk.green('\n✅ Successfully obtained access token!\n'));
      console.log(chalk.blue('Token Information:'));
      console.log(chalk.cyan(`   Access Token: ${result.accessToken?.slice(0, 20)}...`));
      console.log(chalk.cyan(`   Token Type: ${result.tokenType}`));
      if (result.expiresIn) {
        console.log(chalk.cyan(`   Expires In: ${result.expiresIn} seconds`));
      }
      if (result.refreshToken) {
        console.log(chalk.cyan(`   Refresh Token: ${result.refreshToken?.slice(0, 20)}...`));
      }
      console.log(
        chalk.yellow(
          '\n💡 Save this token in your environment or collection settings to use in requests.\n'
        )
      );
    } catch (error) {
      logger.error('Failed to exchange authorization code', error);
      throw error;
    }
  });

/**
 * OAuth 2.0: Get token using Client Credentials flow
 */
authCommand
  .command('oauth2-client-credentials')
  .description('Get access token using Client Credentials flow')
  .requiredOption('--client-id <id>', 'OAuth 2.0 client ID')
  .requiredOption('--client-secret <secret>', 'Client secret')
  .requiredOption('--token-url <url>', 'Token endpoint URL')
  .option('--scope <scope>', 'Requested scope(s)')
  .action(async (options) => {
    try {
      const config: OAuth2Config = {
        grantType: 'client_credentials',
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        tokenUrl: options.tokenUrl,
        scope: options.scope,
      };

      const result = await getClientCredentialsToken(config);

      console.log(chalk.green('\n✅ Successfully obtained access token!\n'));
      console.log(chalk.blue('Token Information:'));
      console.log(chalk.cyan(`   Access Token: ${result.accessToken?.slice(0, 20)}...`));
      console.log(chalk.cyan(`   Token Type: ${result.tokenType}`));
      if (result.expiresIn) {
        console.log(chalk.cyan(`   Expires In: ${result.expiresIn} seconds`));
      }
      console.log(
        chalk.yellow(
          '\n💡 Save this token in your environment or collection settings to use in requests.\n'
        )
      );
    } catch (error) {
      logger.error('Failed to get client credentials token', error);
      throw error;
    }
  });

/**
 * Generate PKCE code verifier and challenge
 */
authCommand
  .command('pkce-generate')
  .description('Generate PKCE code verifier and challenge')
  .action(() => {
    try {
      const { codeVerifier, codeChallenge } = generatePKCE();

      console.log(chalk.green('\n✅ PKCE credentials generated!\n'));
      console.log(chalk.blue('PKCE Values:'));
      console.log(chalk.cyan(`   Code Verifier: ${codeVerifier}`));
      console.log(chalk.cyan(`   Code Challenge: ${codeChallenge}`));
      console.log(chalk.cyan(`   Challenge Method: S256\n`));
      console.log(
        chalk.yellow(
          '💡 Use the code challenge in the authorization URL and the code verifier for token exchange.\n'
        )
      );
    } catch (error) {
      logger.error('Failed to generate PKCE credentials', error);
      throw error;
    }
  });

