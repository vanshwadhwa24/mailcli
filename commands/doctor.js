import fs from 'fs';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';
import chalk from 'chalk';
import ora from 'ora';
import { google } from 'googleapis';

export async function runDoctor() {
  const envPath = path.join(os.homedir(), '.mailcli', '.env');
  const spinner = ora('Running system check...').start();

  // 1. Check if .env file exists
  if (!fs.existsSync(envPath)) {
    spinner.fail(`❌ .env file not found at ${envPath}`);
    return;
  }

  dotenv.config({ path: envPath });

  // 2. Check required variables
  const requiredKeys = ['CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI'];
  const missing = requiredKeys.filter(k => !process.env[k]);

  if (missing.length) {
    spinner.fail(`❌ Missing keys in .env: ${missing.join(', ')}`);
    return;
  }

  // 3. Try Gmail API call
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    await gmail.users.getProfile({ userId: 'me' });

    spinner.succeed(`${chalk.green('✔')} Everything looks good! MailCLI is ready to roll.`);
  } catch (err) {
    spinner.fail(`${chalk.red('✗')} Gmail API error: ${err.message}`);
  }
}
