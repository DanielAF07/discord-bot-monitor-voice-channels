require('dotenv').config();
const { createClient } = require('./client');
const { loadConfig } = require('./utils/config');
const { handleReady } = require('./events/ready');
const { handleInteraction } = require('./events/interaction');
const { handleVoiceStateUpdate } = require('./events/voiceState');

// Load configuration
const config = loadConfig();

// Crear cliente de Discord
const client = createClient();

// Eventos
client.once('ready', async () => {
  await handleReady(client, config);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  await handleVoiceStateUpdate(oldState, newState, client, config);
});

client.on('interactionCreate', async interaction => {
  await handleInteraction(interaction, config);
});

// Error handling
client.on('error', error => {
  console.error('❌ Discord client error:', error);
});

client.on('warn', warning => {
  console.warn('⚠️  Warning:', warning);
});

// Start bot login
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ Error: DISCORD_TOKEN not found in environment variables');
  console.error('   Create a .env file with your Discord token');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
