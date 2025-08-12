async function sendNotificationDM(client, config, message, guild) {
  if (
    !config.settings.enableDmNotifications ||
    !config.notificationRecipients
  ) {
    return;
  }

  for (const recipient of config.notificationRecipients) {
    try {
      // Check if user is connected to any voice channel in the server
      const member = await guild.members
        .fetch(recipient.userId)
        .catch(() => null);
      if (member && member.voice.channel) {
        console.log(
          `⏸️  Skipping notification for ${recipient.username} (connected in ${member.voice.channel.name})`
        );
        continue;
      }

      const user = await client.users.fetch(recipient.userId);
      await user.send(message);
      console.log(`📨 Notification sent to ${recipient.username}`);
    } catch (error) {
      console.error(
        `❌ Error sending DM to ${recipient.username}:`,
        error.message
      );
    }
  }
}

module.exports = {
  sendNotificationDM
};
