const { registerCommands } = require('../commands');

async function handleReady(client, config) {
  console.log(`✅ Bot connected as ${client.user.tag}`);
  console.log('🔊 Monitoring voice channels...');
  console.log(`📋 Monitored users: ${config.monitoredUsers.length}`);
  if (config.settings.logAllUsers) {
    console.log('⚠️  Mode: Monitoring ALL users');
  }

  // Register slash commands automatically
  await registerCommands();

  console.log(
    '💡 Use slash commands: /add, /remove, /list, /toggle, /reload, /help'
  );
}

module.exports = {
  handleReady
};
