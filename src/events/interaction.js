const { PermissionFlagsBits } = require('discord.js');
const { handleCommand } = require('../commands');

async function handleInteraction(interaction, config) {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  // Only allow administrator commands
  if (!interaction.member?.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: '❌ Only administrators can use these commands.',
      ephemeral: true
    });
  }

  try {
    await handleCommand(interaction, config);
  } catch (error) {
    console.error('Error handling slash command:', error);
    if (!interaction.replied) {
      await interaction.reply({
        content: '❌ Error executing command.',
        ephemeral: true
      });
    }
  }
}

module.exports = {
  handleInteraction
};
