// commands/list.js
import { google } from 'googleapis';
import chalk from 'chalk';
import ora from 'ora';
import { getOAuth2Client } from '../auth/login.js';

export async function listEmails() {
  const spinner = ora('Fetching your emails...').start();

  try {
    const auth = await getOAuth2Client();
    const gmail = google.gmail({ version: 'v1', auth });

    // Fetch list of message IDs (most recent 10)
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });

    const messages = res.data.messages;

    if (!messages || messages.length === 0) {
      spinner.fail('No emails found.');
      return;
    }

    spinner.succeed(`📨 You have ${messages.length} recent emails:\n`);

    let count = 1;

    for (const msg of messages) {
      const msgRes = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['From', 'Subject', 'Date'],
      });

      const headers = msgRes.data.payload.headers;

      const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
      const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
      const date = headers.find(h => h.name === 'Date')?.value?.split(', ').pop()?.split(' ').slice(0, 3).join(' ') || 'Unknown Date';

      console.log(`${chalk.yellow(`[${count++}]`)} From: ${chalk.cyan(from)} | Subject: ${chalk.green(subject)} | Date: ${chalk.magenta(date)}`);
    }
  } catch (err) {
    spinner.fail('Failed to fetch emails.');
    console.error(err.message);
  }
}
