# MailCLI


MailCLI is a terminal-based Gmail client built for those who like their inbox fast, focused, and fully functional—from the command line.

Made with love, grit, and a bit of Batman.

---

🚀 Features

- 📥 Browse your latest emails
- 📨 Compose and send new messages with a smooth guided flow
- 🎯 Clean, interactive UI in your terminal
- 🔐 OAuth2-based secure login
- 💬 Want to join as a test user? Just drop a mail to the dev—see below.

---

🛠️ Installation

```bash
npm install -g mailcli
```

Then run:

```bash
mailcli auth
```

---

🔐 One-Time OAuth Setup (Google API)

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a project
3. Navigate to OAuth consent screen → Choose External → Fill the info
4. Create credentials:  
   Credentials → Create Credentials → OAuth Client ID → Web Application
   - Add Authorized redirect URI: http://localhost:3000
5. Download the credentials.json  
   Place it in the root of your project or at ~/.mailcli/credentials.json

---

📦 CLI Usage

```bash
mailcli auth        # Authorize your account
mailcli inbox       # Browse and read emails
mailcli compose     # Compose a new email
mailcli cmd         # Run raw Gmail API commands
mailcli list        # List recents emails
```

---

🧠 Compose Flow

mailcli compose walks you through:

1. To
2. Subject
3. CC / BCC
4. Body

Making sure your message is clear and clean before sending.

---

💌 Test User Access

Want to be part of private testing or help improve the tool?

📫 Send a mail to: vansh.dev.inbox@gmail.com  
Mention you'd like to join as a test user—I'll hook you up.

---
Has an Easter Egg(s)
---

👨‍💻 Author

Vansh Wadhwa  


---

🪪 License

MIT License

---

⚡ Quick Demo (Coming Soon)
