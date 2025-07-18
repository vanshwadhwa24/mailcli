// commands/commands.js
import chalk from 'chalk';

export function showAllCommands() {
  console.log(chalk.bold.green('\n📬 Welcome to mailcli - Your Gmail Terminal Client\n'));

  console.log(chalk.cyan('Available Commands:\n'));

  console.log(`${chalk.yellow('mailcli cmd')}       → Show all available commands`);
  console.log(`${chalk.yellow('mailcli --help')}    → Ask for help`);
  console.log(`${chalk.yellow('mailcli doctor')}    → Run diagonastic `);
  console.log(`${chalk.yellow('mailcli --version')} → Check current version of mailcli`);
  console.log(`${chalk.yellow('mailcli list')}      → List your recent emails`);
  console.log(`${chalk.yellow('mailcli inbox')}      → Open inbox and read mails`);
  console.log(`${chalk.yellow('mailcli compose')}   → Compose and send a new email`);
  console.log(`\n${chalk.magentaBright('        Built by')} ${chalk.redBright('Vansh Wadhwa')}\n`);
  

}
