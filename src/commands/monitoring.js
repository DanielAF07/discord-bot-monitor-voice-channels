const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {
  addUserToMonitor,
  removeUserFromMonitor,
  saveConfig
} = require('../utils/config');

const commands = [
  new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add user to voice channel monitoring')
    .addUserOption(option =>
      option.setName('user').setDescription('User to add').setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('note')
        .setDescription('Optional note about the user')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove user from monitoring')
    .addUserOption(option =>
      option.setName('user').setDescription('User to remove').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('list')
    .setDescription('View list of monitored users')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('toggle')
    .setDescription('Toggle between monitoring all users or only the list')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
];

async function handleMonitoringCommands(interaction, config) {
  const { commandName } = interaction;

  switch (commandName) {
    case 'add':
      const userToAdd = interaction.options.getUser('user');
      const note =
        interaction.options.getString('note') || 'Added via slash command';

      if (addUserToMonitor(config, userToAdd.id, userToAdd.tag, note)) {
        await interaction.reply({
        content: `✅ User ${userToAdd.tag} added to monitoring.`,
        ephemeral: true
      });
      } else {
        await interaction.reply({
        content: `⚠️ User ${userToAdd.tag} is already being monitored.`,
        ephemeral: true
      });
      }
      break;

    case 'remove':
      const userToRemove = interaction.options.getUser('user');

      if (removeUserFromMonitor(config, userToRemove.id)) {
        await interaction.reply({
        content: `✅ User ${userToRemove.tag} removed from monitoring.`,
        ephemeral: true
      });
      } else {
        await interaction.reply({
        content: `⚠️ User ${userToRemove.tag} is not in the monitoring list.`,
        ephemeral: true
      });
      }
      break;

    case 'list':
      if (config.monitoredUsers.length === 0) {
        return interaction.reply({
        content: '📋 No users are being monitored.',
        ephemeral: true
      });
      }

      const userList = config.monitoredUsers
      .map(
        (user, index) =>
          `${index + 1}. ${user.username} (${user.userId})${user.note ? ' - ' + user.note : ''}`
      )
      .join('\n');

      await interaction.reply({
      content: `📋 **Monitored users:**\n\`\`\`\n${userList}\n\`\`\``,
      ephemeral: true
    });
      break;

    case 'toggle':
      config.settings.logAllUsers = !config.settings.logAllUsers;
      saveConfig(config);
      const status = config.settings.logAllUsers ? 'ALL' : 'only users in list';
      await interaction.reply({
      content: `🔄 Mode changed: monitoring **${status}** users.`,
      ephemeral: true
    });
      break;

    default:
      return false;
  }

  return true;
}

module.exports = {
  commands,
  handleMonitoringCommands
};
