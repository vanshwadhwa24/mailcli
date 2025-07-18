// commands/inbox.js
import { google } from 'googleapis';
import ora from 'ora';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { getOAuth2Client } from '../auth/login.js';

export async function showInbox() {
  const auth = await getOAuth2Client();
  const gmail = google.gmail({ version: 'v1', auth });

  const spinner = ora('Fetching emails...').start();

  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });

    const messages = res.data.messages || [];

    if (!messages.length) {
      spinner.fail('No emails found!');
      return;
    }

    spinner.succeed('Emails fetched successfully!');

    // Get email snippets
    const emails = await Promise.all(messages.map(async (msg) => {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['Subject', 'From'],
      });

      const headers = full.data.payload.headers;

      const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
      const from = headers.find(h => h.name === 'From')?.value || '(Unknown Sender)';

      return {
        name: `${chalk.yellow(subject)} ${chalk.gray('—')} ${chalk.cyan(from)}`,
        value: msg.id,
      };
    }));

    const { selectedId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedId',
        message: 'Select an email to read:',
        choices: emails,
        pageSize: 10,
      },
    ]);

    // Fetch full message
    const emailRes = await gmail.users.messages.get({
      userId: 'me',
      id: selectedId,
      format: 'full',
    });

    const message = emailRes.data;
    const bodyData = message.payload.parts?.find(part => part.mimeType === 'text/plain')?.body?.data 
                  || message.payload.body?.data;

    const decodedBody = bodyData
      ? Buffer.from(bodyData, 'base64').toString('utf-8')
      : '(No content available)';

    console.log(`\n${chalk.green('Subject:')} ${chalk.white.bold(
      message.payload.headers.find(h => h.name === 'Subject')?.value || '(No Subject)'
    )}`);

    console.log(`${chalk.green('From:')} ${message.payload.headers.find(h => h.name === 'From')?.value || 'Unknown'}`);

    console.log(`\n${chalk.white(decodedBody)}\n`);

  } catch (error) {
    spinner.fail('Failed to load inbox');
    console.error(error.message);
  }
}
