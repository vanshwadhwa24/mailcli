#!/usr/bin/env node

import { Command } from 'commander';
import { getOAuth2Client } from './auth/login.js';

const program = new Command();

program
  .name('mailcli')
  .description('📬 A command-line Gmail client')
  .version('0.1.0');

// Basic test command
program
  .command('vansh')
  .description('Check if CLI is working')
  .action(() => {
    console.log('wadhwa');
  });

// Placeholder for auth-dependent command
program
  .command('auth')
  .description('Authenticate with Gmail')
  .action(async () => {
    const auth = await getOAuth2Client();
    console.log(' Auth success:', !!auth);
  });

program.parse();
