const { REST, Routes } = require('discord.js');
const monitoringCommands = require('./monitoring');
const notificationCommands = require('./notifications');
const systemCommands = require('./system');

// Combine all commands
const commands = [
  ...monitoringCommands.commands,
  ...notificationCommands.commands,
  ...systemCommands.commands
];

// Register slash commands
async function registerCommands() {
  try {
    const rest = new REST({ version: '10' }).setToken(
      process.env.DISCORD_TOKEN
    );

    console.log('🔄 Registering slash commands...');

    // Convert commands to JSON before sending
    const commandsData = commands.map(command => command.toJSON());

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commandsData
    });

    console.log('✅ Slash commands registered successfully');
    console.log(
      `📝 Registered ${commandsData.length} commands: ${commandsData.map(c => c.name).join(', ')}`
    );
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
    console.error('Details:', error.message);
  }
}

// Handle commands
async function handleCommand(interaction, config) {
  // Try to handle with each command module
  if (await monitoringCommands.handleMonitoringCommands(interaction, config)) {
    return;
  }

  if (
    await notificationCommands.handleNotificationCommands(interaction, config)
  ) {
    return;
  }

  if (await systemCommands.handleSystemCommands(interaction, config)) {
    return;
  }

  // If no module handled the command
  await interaction.reply({
    content: '❌ Command not recognized.',
    ephemeral: true
  });
}

module.exports = {
  commands,
  registerCommands,
  handleCommand
};
