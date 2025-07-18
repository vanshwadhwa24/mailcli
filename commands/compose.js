import { google } from 'googleapis';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { getOAuth2Client } from '../auth/login.js';
import { encode } from 'js-base64';

export async function composeEmail() {
  console.log(chalk.cyan('\n💌 Let’s compose your email!\n'));

  const questions = [
    {
      type: 'input',
      name: 'to',
      message: '📨 Send To:',
      validate: (input) => input.includes('@') || 'Please enter a valid email address',
    },
    {
      type: 'input',
      name: 'subject',
      message: '✏️ Subject:',
    },
    {
      type: 'input',
      name: 'cc',
      message: '📋 CC (comma-separated, optional):',
    },
    {
      type: 'input',
      name: 'bcc',
      message: '🔒 BCC (comma-separated, optional):',
    },
    {
      type: 'editor',
      name: 'body',
      message: '📝 Body (your default editor will open):',
      validate: (input) => input.trim().length > 0 || 'Body cannot be empty.',
    },
  ];

  try {
    const answers = await inquirer.prompt(questions);
    const spinner = ora('Sending email...').start();

    const { to, subject, cc, bcc, body } = answers;
    const auth = await getOAuth2Client();
    const gmail = google.gmail({ version: 'v1', auth });

    const emailLines = [];

    emailLines.push(`To: ${to}`);
    if (cc) emailLines.push(`Cc: ${cc}`);
    if (bcc) emailLines.push(`Bcc: ${bcc}`);
    emailLines.push(`Subject: ${subject}`);
    emailLines.push('Content-Type: text/plain; charset="UTF-8"');
    emailLines.push('');
    emailLines.push(body);

    const rawMessage = encode(emailLines.join('\n'));

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: rawMessage,
      },
    });

    spinner.succeed('✅ Email sent successfully!');
  } catch (error) {
    console.error(chalk.red('❌ Failed to send email:'), error.message);
  }
}
