const {
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');
require('dotenv').config();

// Verificar variables de entorno
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ Error: DISCORD_TOKEN no encontrado en .env');
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error('❌ Error: CLIENT_ID no encontrado en .env');
  process.exit(1);
}

// Definir comandos slash
const commands = [
  new SlashCommandBuilder()
    .setName('add')
    .setDescription('Agregar usuario al monitoreo de canales de voz')
    .addUserOption(option =>
      option
        .setName('usuario')
        .setDescription('Usuario a agregar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('nota')
        .setDescription('Nota opcional sobre el usuario')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remover usuario del monitoreo')
    .addUserOption(option =>
      option
        .setName('usuario')
        .setDescription('Usuario a remover')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('list')
    .setDescription('Ver lista de usuarios monitoreados')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('toggle')
    .setDescription(
      'Alternar entre monitorear todos los usuarios o solo la lista'
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Recargar configuración desde config.json')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('notify-add')
    .setDescription('Agregar usuario para recibir notificaciones por DM')
    .addUserOption(option =>
      option
        .setName('usuario')
        .setDescription('Usuario que recibirá notificaciones')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('nota')
        .setDescription('Nota opcional sobre el usuario')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('notify-remove')
    .setDescription('Remover usuario de las notificaciones por DM')
    .addUserOption(option =>
      option
        .setName('usuario')
        .setDescription('Usuario a remover de notificaciones')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('notify-list')
    .setDescription('Ver lista de usuarios que reciben notificaciones')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('notify-toggle')
    .setDescription('Activar/desactivar notificaciones por DM')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Mostrar ayuda de comandos')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
];

async function registerCommands() {
  try {
    const rest = new REST({ version: '10' }).setToken(
      process.env.DISCORD_TOKEN
    );

    console.log('🔄 Registrando comandos slash...');
    console.log(`📋 Bot ID: ${process.env.CLIENT_ID}`);

    // Convertir comandos a JSON
    const commandsData = commands.map(command => command.toJSON());
    console.log(
      `📝 Comandos a registrar: ${commandsData.map(c => c.name).join(', ')}`
    );

    // Registrar comandos
    const result = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandsData }
    );

    console.log('✅ Slash commands registered successfully');
    console.log(`🎉 ${result.length} commands registered successfully`);
  } catch (error) {
    console.error('❌ Error registrando comandos slash:');
    console.error('Error code:', error.code);
    console.error('Message:', error.message);
    console.error('Status:', error.status);

    if (error.code === 50001) {
      console.error(
        '💡 Asegúrate de que el bot tenga permisos de "applications.commands"'
      );
    }
    if (error.code === 10013) {
      console.error('💡 Verifica que el CLIENT_ID sea correcto');
    }
  }
}

registerCommands();
