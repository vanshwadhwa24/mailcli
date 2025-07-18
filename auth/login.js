// auth/login.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import open from 'open';
import http from 'http';
import { URL } from 'url';
import 'dotenv/config';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to credential and token files
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Loads credentials and returns an authenticated OAuth2 client
export async function getOAuth2Client() {

 const client_id = process.env.CLIENT_ID;
 const client_secret = process.env.CLIENT_SECRET;
 const redirect_uris = [process.env.REDIRECT_URI];

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

// Handles user login and token exchange
async function getNewToken(oAuth2Client) {
  const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    // Add more scopes later (send, draft, etc.)
  ];

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

// Starts a lightweight server to listen for the OAuth redirect with code
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
        console.log('🛰️  Waiting for authentication at http://localhost:3000...');
      })
      .on('error', (err) => {
        console.error('❌ Failed to start auth server:', err.message);
        reject(err);
      });
  });
}
