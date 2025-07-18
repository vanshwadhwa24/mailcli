#!/usr/bin/env node

import { Command } from 'commander';
import { getOAuth2Client } from './auth/login.js';
import{showAllCommands} from './commands/commands.js';
import{listEmails} from './commands/list.js';
import { showInbox } from './commands/inbox.js';
import { composeEmail } from './commands/compose.js';
import bat from './commands/bat.js'

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

  program
  .command('cmd')
  .description('List all the commands')
  .action(showAllCommands)

  program
  .command('list')
  .description('List recent mails')
  .action(listEmails)
  
  program 
  .command('inbox')
  .description('Open your inbox')
  .action(showInbox)

  program
  .command('compose')
  .description('Write an email')
  .action(composeEmail)

  program
  .command('bat')
  .description(`I'm Batman`)
  .action(bat)


program.parse();
