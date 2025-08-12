function logVoiceEvent(type, member, guild, details = {}) {
  const timestamp = new Date().toLocaleString('en-US');

  switch (type) {
    case 'join':
      console.log(`🎤 ${member.user.tag} joined channel: ${details.channel}`);
      break;
    case 'leave':
      console.log(`🚪 ${member.user.tag} left channel: ${details.channel}`);
      break;
    case 'move':
      console.log(`↔️  ${member.user.tag} moved:`);
      console.log(`   From: ${details.from}`);
      console.log(`   To: ${details.to}`);
      break;
    case 'mute':
      const muteStatus = details.muted ? 'muted' : 'unmuted';
      console.log(
      `🎙️  ${member.user.tag} ${muteStatus} their microphone in ${details.channel}`
    );
      break;
    case 'deafen':
      const deafStatus = details.deafened ? 'deafened' : 'undeafened';
      console.log(
      `🔇 ${member.user.tag} ${deafStatus} their audio in ${details.channel}`
    );
      break;
  }

  console.log(`   ID: ${member.user.id}`);
  console.log(`   Server: ${guild.name}`);
  console.log(`   Time: ${timestamp}`);
  console.log('---');

  return timestamp;
}

module.exports = {
  logVoiceEvent
};
