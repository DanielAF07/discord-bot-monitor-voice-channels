const { isUserMonitored } = require('../utils/config');
const { sendNotificationDM } = require('../utils/notifications');
const { logVoiceEvent } = require('../utils/logger');

async function handleVoiceStateUpdate(oldState, newState, client, config) {
  const member = newState.member || oldState.member;
  const guild = newState.guild || oldState.guild;

  // Check if user should be monitored
  if (!isUserMonitored(config, member.user.id, member.user.tag)) {
    return;
  }

  // User joins a channel
  if (!oldState.channel && newState.channel && config.settings.logJoin) {
    const timestamp = logVoiceEvent('join', member, guild, {
      channel: newState.channel.name
    });

    const dmMessage = `🎤 **${member.user.tag}** joined channel **${newState.channel.name}**\n📅 ${timestamp}\n🏠 Server: ${guild.name}`;
    await sendNotificationDM(client, config, dmMessage, guild);
  }

  // User leaves a channel
  if (oldState.channel && !newState.channel && config.settings.logLeave) {
    const timestamp = logVoiceEvent('leave', member, guild, {
      channel: oldState.channel.name
    });

    const dmMessage = `🚪 **${member.user.tag}** left channel **${oldState.channel.name}**\n📅 ${timestamp}\n🏠 Server: ${guild.name}`;
    await sendNotificationDM(client, config, dmMessage, guild);
  }

  // User moves between channels
  if (
    oldState.channel &&
    newState.channel &&
    oldState.channel.id !== newState.channel.id &&
    config.settings.logMoveBetweenChannels
  ) {
    const timestamp = logVoiceEvent('move', member, guild, {
      from: oldState.channel.name,
      to: newState.channel.name
    });

    const dmMessage = `↔️ **${member.user.tag}** moved:\n📤 From: **${oldState.channel.name}**\n📥 To: **${newState.channel.name}**\n📅 ${timestamp}\n🏠 Server: ${guild.name}`;
    await sendNotificationDM(client, config, dmMessage, guild);
  }

  // User mutes/unmutes microphone
  if (oldState.mute !== newState.mute && config.settings.logMuteUnmute) {
    const timestamp = logVoiceEvent('mute', member, guild, {
      muted: newState.mute,
      channel: newState.channel?.name || oldState.channel?.name
    });

    const muteStatus = newState.mute ? 'muted' : 'unmuted';
    const emoji = newState.mute ? '🔇' : '🎙️';
    const dmMessage = `${emoji} **${member.user.tag}** ${muteStatus} their microphone\n📍 Channel: **${newState.channel?.name || oldState.channel?.name}**\n📅 ${timestamp}\n🏠 Server: ${guild.name}`;
    await sendNotificationDM(client, config, dmMessage, guild);
  }

  // User deafens/undeafens audio
  if (oldState.deaf !== newState.deaf && config.settings.logDeafenUndeafen) {
    const timestamp = logVoiceEvent('deafen', member, guild, {
      deafened: newState.deaf,
      channel: newState.channel?.name || oldState.channel?.name
    });

    const deafStatus = newState.deaf ? 'deafened' : 'undeafened';
    const emoji = newState.deaf ? '🔇' : '🔊';
    const dmMessage = `${emoji} **${member.user.tag}** ${deafStatus} their audio\n📍 Channel: **${newState.channel?.name || oldState.channel?.name}**\n📅 ${timestamp}\n🏠 Server: ${guild.name}`;
    await sendNotificationDM(client, config, dmMessage, guild);
  }
}

module.exports = {
  handleVoiceStateUpdate
};
