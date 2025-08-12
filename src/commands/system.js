const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { reloadConfig } = require('../utils/config');

const commands = [
  new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload configuration from config.json')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show command help')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
];

async function handleSystemCommands(interaction, config) {
  const { commandName } = interaction;

  switch (commandName) {
    case 'reload':
      const newConfig = reloadConfig();
      if (newConfig) {
        Object.assign(config, newConfig);
        await interaction.reply({
        content: '✅ Configuration reloaded successfully.',
        ephemeral: true
      });
      } else {
        await interaction.reply({
        content: '❌ Error reloading configuration.',
        ephemeral: true
      });
      }
      break;

    case 'help':
      const helpMessage = `
**Monitoring commands:**
\`/add user [note]\` - Add user to monitoring
\`/remove user\` - Remove user from monitoring  
\`/list\` - View monitored users
\`/toggle\` - Toggle between monitoring all users or only the list

**Notification commands:**
\`/notify-add user [note]\` - Add user to receive DM notifications
\`/notify-remove user\` - Remove user from notifications
\`/notify-list\` - View users receiving notifications
\`/notify-toggle\` - Enable/disable DM notifications

**Other commands:**
\`/reload\` - Reload configuration from config.json
\`/help\` - Show this help

**Note:** Commands are only visible to you (ephemeral).
      `;
      await interaction.reply({ content: helpMessage, ephemeral: true });
      break;

    default:
      return false;
  }

  return true;
}

module.exports = {
  commands,
  handleSystemCommands
};
