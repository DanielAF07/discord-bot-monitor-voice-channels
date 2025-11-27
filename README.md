# Voice Log Bot

A personal Discord bot that logs when users join voice channels and sends DM notifications to help coordinate gaming sessions with friends.

## 📋 Features

- **Selective monitoring**: Logs activity only for specific users on your list
- **Easy user management**: Simple commands to add/remove users from monitoring
- **Flexible configuration**: Detailed control over which events to log
- **Complete monitoring**: Detects join/leave, movement between channels, mute/unmute
- **Personal use**: Designed for private servers and friend groups
- **Discord commands**: Manage the list directly from Discord

## 🚀 Installation

### Prerequisites

- Node.js (version 16 or higher)
- A Discord Bot application created in [Discord Developer Portal](https://discord.com/developers/applications)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voice-log-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application and bot
   - Copy the bot token
   - Create a `.env` file in the project root:
   ```env
   DISCORD_TOKEN=your_token_here
   CLIENT_ID=your_bot_id
   ```

4. **Configure monitored users**
   - The bot will automatically create a `config.json` file on first run with default settings
   - Use Discord slash commands to add users (recommended), or
   - Manually edit `config.json` following the structure in `config.example.json`
   
   **Note:** `config.json` is ignored by git to protect sensitive user data

5. **Invite the bot to your server**
   - In Developer Portal, go to OAuth2 > URL Generator
   - Select scopes: `bot` and `applications.commands`
   - Select permissions: `Use Slash Commands`, `Connect`, `View Channels`
   - Use the generated URL to invite the bot

## 📖 Usage

### Running the bot

#### With Node.js
```bash
npm start
```

#### With Docker
```bash
# Build the Docker image
docker build -t voice-log-bot .

# Run with Docker volume to persist config
docker run -d \
  --name voice-log-bot \
  --env-file .env \
  -v $(pwd)/config.json:/app/config.json \
  voice-log-bot

# Or run with a named volume (recommended)
docker volume create voice-log-bot-config
docker run -d \
  --name voice-log-bot \
  --env-file .env \
  -v voice-log-bot-config:/app \
  voice-log-bot
```

### Discord Slash Commands

Use these slash commands in any channel where the bot has permissions (administrators only):

- `/add user [note]` - Add user to monitoring
- `/remove user` - Remove user from monitoring  
- `/list` - View monitored users
- `/toggle` - Toggle between monitoring all users or only the list
- `/reload` - Reload configuration from config.json
- `/notify-add user [note]` - Add user to DM notifications
- `/notify-remove user` - Remove user from DM notifications
- `/notify-list` - View notification recipients
- `/notify-toggle` - Toggle DM notifications on/off
- `/help` - Show command help

**Note:** All commands are ephemeral (only you can see the responses)

### Functionality

The bot logs to console when monitored users:
1. **Join/leave** voice channels
2. **Move** between voice channels
3. **Mute/unmute** their microphone
4. **Deafen/undeafen** their audio

### Getting user IDs

To add users to `config.json`, you need their IDs:
1. Enable "Developer mode" in Discord (Settings > Advanced)
2. Right-click on the user > "Copy ID"
3. Use that ID in the configuration

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Discord bot token | ✅ |
| `CLIENT_ID` | Bot application ID | ✅ |

### Customization

The bot can be customized by editing the main file to:
- Change notification format
- Filter specific channels
- Modify the list of users who receive DMs

## 🔧 Development

### Project structure
```
voice-log-bot/
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (don't commit to git)
├── config.json           # Bot configuration
├── src/
│   ├── index.js          # Main bot file
│   ├── client.js         # Discord client setup
│   ├── events/           # Event handlers
│   ├── commands/         # Slash command definitions
│   └── utils/            # Utility functions
├── scripts/              # Helper scripts
└── README.md             # This file
```

### Available scripts

- `npm start` - Run the bot
- `npm run dev` - Run with file watching for development
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with automatic fixes
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run register-commands` - Register slash commands with Discord
- `npm run clear-commands` - Clear all registered slash commands

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-functionality`)
3. Commit your changes (`git commit -am 'Add new functionality'`)
4. Push to the branch (`git push origin feature/new-functionality`)
5. Open a Pull Request

## 📝 Important Notes

- **Privacy**: This bot is designed for personal use on private servers
- **Permissions**: Make sure the bot has necessary permissions on your server
- **Limits**: Respect Discord API rate limits to avoid rate limiting

## 📄 License

This project is under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **Bot doesn't connect**
   - Verify the token is correct
   - Make sure the bot is invited to the server

2. **Not receiving DMs**
   - Check that you have DMs enabled from server members
   - Confirm the bot has permissions to send messages

3. **Bot doesn't detect voice connections**
   - Verify the bot has "Connect" permissions in voice channels
   - Make sure it has the `GuildVoiceStates` intent enabled

For more help, check the bot logs or open an issue in the repository.