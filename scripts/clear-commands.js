const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function clearCommands() {
  try {
    console.log('🧹 Eliminando todos los comandos slash...');

    // Eliminar comandos globales
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: []
    });
    console.log('✅ Comandos globales eliminados');

    // También eliminar comandos de guild específicos si los hubiera
    // (esto es opcional, pero útil si tienes comandos de desarrollo)
    const guilds = await rest.get(Routes.userGuilds());

    for (const guild of guilds) {
      try {
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
          { body: [] }
        );
        console.log(`✅ Comandos eliminados del servidor: ${guild.name}`);
      } catch (error) {
        console.log(
          `⚠️  No se pudieron eliminar comandos de ${guild.name} (normal si no había comandos)`
        );
      }
    }

    console.log('🎉 Todos los comandos han sido eliminados');
    console.log(
      '💡 Ahora puedes ejecutar "npm start" para registrar los nuevos comandos'

  } catch (error) {
    console.error('❌ Error eliminando comandos:', error);
  }
}

clearCommands();
