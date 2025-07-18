// auth/login.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import open from 'open';
import http from 'http';
import { URL } from 'url';
import dotenv from 'dotenv';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually resolve path to global .mailcli directory in user's home
const MAILCLI_DIR = path.join(os.homedir(), '.mailcli');
const ENV_PATH = path.join(MAILCLI_DIR, '.env');
const CREDENTIALS_PATH = path.join(MAILCLI_DIR, 'credentials.json');
const TOKEN_PATH = path.join(MAILCLI_DIR, 'token.json');

// Load .env from global ~/.mailcli
dotenv.config({ path: ENV_PATH });

export async function getOAuth2Client() {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uris = [process.env.REDIRECT_URI];

  if (!client_id || !client_secret || !redirect_uris[0]) {
    console.error("❌ Missing required OAuth credentials in .env file at", ENV_PATH);
    process.exit(1);
  }

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  try {
    const token = await fs.readFile(TOKEN_PATH, 'utf-8');
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    return await getNewToken(oAuth2Client);
  }
}

async function getNewToken(oAuth2Client) {
  const SCOPES = ['https://mail.google.com/'];

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('\n🔑 Opening browser for authentication...\n');
  await open(authUrl);

  const code = await listenForAuthCode();
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  await fs.mkdir(path.dirname(TOKEN_PATH), { recursive: true });
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));

  console.log('✅ Token stored to', TOKEN_PATH);
  return oAuth2Client;
}

function listenForAuthCode() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, 'http://localhost:3000');
        const code = url.searchParams.get('code');

        if (code) {
          res.end('✅ Authentication successful! You can close this tab.');
          server.close();
          resolve(code);
        } else {
          res.end('❌ No code found.');
          reject(new Error('No code in URL.'));
        }
      } catch (err) {
        reject(err);
      }
    });

    server.listen(3000)
      .on('listening', () => {
        console.log('🌐 Waiting for authentication at http://localhost:3000...');
      })
      .on('error', (err) => {
        console.error('❌ Failed to start auth server:', err.message);
        reject(err);
      });
  });
}
    