// commands/inbox.js
import { google } from 'googleapis';
import ora from 'ora';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { getOAuth2Client } from '../auth/login.js';

export async function showInbox() {
  const spinner = ora('Fetching your inbox...').start();

  try {
    const auth = await getOAuth2Client();
    const gmail = google.gmail({ version: 'v1', auth });

    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });

    const messages = res.data.messages;

    if (!messages || messages.length === 0) {
      spinner.fail('No emails found.');
      return;
    }

    spinner.succeed(` Inbox loaded! Select a message to read:\n`);

    const fullEmails = await Promise.all(
  messages.map((msg) =>
    gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
      format: 'metadata',
      metadataHeaders: ['From', 'Subject', 'Date'],
    })
  )
);

const emailChoices = fullEmails.map(({ data }, index) => {
  const headers = data.payload.headers;

  const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
  const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
  const dateRaw = headers.find(h => h.name === 'Date')?.value;
  const date = dateRaw?.split(', ').pop()?.split(' ').slice(0, 3).join(' ') || 'Unknown Date';

  return {
    name: `${chalk.yellow(`[${index + 1}]`)} From: ${chalk.cyan(from)} | Subject: ${chalk.green(subject)} | Date: ${chalk.magenta(date)}`,
    value: data.id,
  };
});


    const { selectedId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedId',
        message: chalk.green(' Select an email to view:'),
        choices: emailChoices,
        pageSize: 10,
      },
    ]);

    const emailRes = await gmail.users.messages.get({
      userId: 'me',
      id: selectedId,
      format: 'full',
    });

    const message = emailRes.data;
    const payload = message.payload;

    const bodyData =
      payload.parts?.find(part => part.mimeType === 'text/plain')?.body?.data ||
      payload.body?.data;

    const decodedBody = bodyData
      ? Buffer.from(bodyData, 'base64').toString('utf-8')
      : chalk.redBright('(No content available — might be HTML or image only)');

    const subject = payload.headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
    const from = payload.headers.find(h => h.name === 'From')?.value || 'Unknown';

    console.log(`\n${chalk.yellow.bold('Subject:')} ${chalk.white.bold(subject)}`);
    console.log(`${chalk.yellow.bold('From:')} ${chalk.cyan(from)}\n`);
    console.log(`${chalk.white(decodedBody)}\n`);
  } catch (error) {
    spinner.fail('Failed to load inbox.');
    console.error(chalk.red(error.message));
  }
}
