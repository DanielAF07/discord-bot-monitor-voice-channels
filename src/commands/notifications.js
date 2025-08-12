const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {
  addNotificationRecipient,
  removeNotificationRecipient,
  saveConfig
} = require('../utils/config');

const commands = [
  new SlashCommandBuilder()
    .setName('notify-add')
    .setDescription('Add user to receive DM notifications')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User who will receive notifications')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('note')
        .setDescription('Optional note about the user')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('notify-remove')
    .setDescription('Remove user from DM notifications')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to remove from notifications')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('notify-list')
    .setDescription('View list of users receiving notifications')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('notify-toggle')
    .setDescription('Enable/disable DM notifications')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
];

async function handleNotificationCommands(interaction, config) {
  const { commandName } = interaction;

  switch (commandName) {
    case 'notify-add':
      const userToNotify = interaction.options.getUser('user');
      const notifyNote =
        interaction.options.getString('note') || 'Added via slash command';

      if (
      addNotificationRecipient(
        config,
        userToNotify.id,
        userToNotify.tag,
        notifyNote
      )
    ) {
        await interaction.reply({
        content: `✅ User ${userToNotify.tag} added to DM notifications.`,
        ephemeral: true
      });
      } else {
        await interaction.reply({
        content: `⚠️ User ${userToNotify.tag} already receives notifications.`,
        ephemeral: true
      });
      }
      break;

    case 'notify-remove':
      const userToRemoveNotify = interaction.options.getUser('user');

      if (removeNotificationRecipient(config, userToRemoveNotify.id)) {
        await interaction.reply({
        content: `✅ User ${userToRemoveNotify.tag} removed from notifications.`,
        ephemeral: true
      });
      } else {
        await interaction.reply({
        content: `⚠️ User ${userToRemoveNotify.tag} is not in the notifications list.`,
        ephemeral: true
      });
      }
      break;

    case 'notify-list':
      if (
      !config.notificationRecipients ||
        config.notificationRecipients.length === 0
    ) {
        return interaction.reply({
        content: '📬 No users are receiving notifications.',
        ephemeral: true
      });
      }

      const notifyList = config.notificationRecipients
      .map(
        (user, index) =>
          `${index + 1}. ${user.username} (${user.userId})${user.note ? ' - ' + user.note : ''}`
      )
      .join('\n');

      await interaction.reply({
      content: `📬 **Users receiving notifications:**\n\`\`\`\n${notifyList}\n\`\`\``,
      ephemeral: true
    });
      break;

    case 'notify-toggle':
      config.settings.enableDmNotifications =
        !config.settings.enableDmNotifications;
      saveConfig(config);
      const notifyStatus = config.settings.enableDmNotifications
      ? 'enabled'
      : 'disabled';
      await interaction.reply({
      content: `🔔 DM notifications **${notifyStatus}**.`,
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
  handleNotificationCommands
};
