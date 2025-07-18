import chalk from 'chalk';
  console.log(chalk.green.bold('\n✅ mailcli installed successfully!\n'));
  console.log(chalk.yellow(`👉 Before you start, do this:\n`));
  console.log(chalk.cyan(`
1. Go to https://console.cloud.google.com/
2. Create credentials, and get:
   - CLIENT_ID
   - CLIENT_SECRET
   - REDIRECT_URI (usually http://localhost:3000)
3. Create a file at: ~/.mailcli/.env

Paste this inside:
---------------------
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
REDIRECT_URI=http://localhost:3000
---------------------

Then run:
$ mailcli auth
`));
  console.log(`\n${chalk.magentaBright('        Built by')} ${chalk.redBright('Vansh Wadhwa')}\n`);
