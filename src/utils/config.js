const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', '..', 'config.json');

function createDefaultConfig() {
  const defaultConfig = {
    monitoredUsers: [],
    notificationRecipients: [],
    settings: {
      logAllUsers: false,
      logJoin: true,
      logLeave: true,
      logMoveBetweenChannels: false,
      logMuteUnmute: false,
      logDeafenUndeafen: false,
      enableDmNotifications: true
    }
  };

  try {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log('📝 config.json created with default settings');
    console.log('💡 Use Discord slash commands to add users to monitor');
    return defaultConfig;
  } catch (error) {
    console.error('❌ Error creating config.json:', error.message);
    process.exit(1);
  }
}

function loadConfig() {
  try {
    if (!fs.existsSync(configPath)) {
      console.log(
        '⚠️  config.json not found, creating default configuration...'
      );
      return createDefaultConfig();
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading config.json:', error.message);
    console.error(
      '💡 Try deleting config.json to regenerate it with default settings'
    );
    process.exit(1);
  }
}

function saveConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error saving configuration:', error.message);
    return false;
  }
}

function reloadConfig() {
  try {
    const newConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('🔄 Configuration reloaded');
    console.log(`📋 Monitored users: ${newConfig.monitoredUsers.length}`);
    return newConfig;
  } catch (error) {
    console.error('❌ Error reloading configuration:', error.message);
    return null;
  }
}

function isUserMonitored(config, userId, username) {
  if (config.settings.logAllUsers) {
    return true;
  }

  return config.monitoredUsers.some(
    user => user.userId === userId || user.username === username
  );
}

function addUserToMonitor(config, userId, username, note = '') {
  const userExists = config.monitoredUsers.some(user => user.userId === userId);
  if (userExists) {
    console.log(`⚠️  User ${username} is already being monitored`);
    return false;
  }

  config.monitoredUsers.push({ userId, username, note });
  saveConfig(config);
  console.log(`➕ User added: ${username}`);
  return true;
}

function removeUserFromMonitor(config, userId) {
  const initialLength = config.monitoredUsers.length;
  config.monitoredUsers = config.monitoredUsers.filter(
    user => user.userId !== userId
  );

  if (config.monitoredUsers.length < initialLength) {
    saveConfig(config);
    console.log('➖ User removed from monitoring');
    return true;
  }

  console.log('⚠️  User not found in the list');
  return false;
}

function addNotificationRecipient(config, userId, username, note = '') {
  if (!config.notificationRecipients) {
    config.notificationRecipients = [];
  }

  const userExists = config.notificationRecipients.some(
    user => user.userId === userId
  );
  if (userExists) {
    console.log(`⚠️  User ${username} already receives notifications`);
    return false;
  }

  config.notificationRecipients.push({ userId, username, note });
  saveConfig(config);
  console.log(`📬 User added to notifications: ${username}`);
  return true;
}

function removeNotificationRecipient(config, userId) {
  if (!config.notificationRecipients) {
    config.notificationRecipients = [];
  }

  const initialLength = config.notificationRecipients.length;
  config.notificationRecipients = config.notificationRecipients.filter(
    user => user.userId !== userId
  );

  if (config.notificationRecipients.length < initialLength) {
    saveConfig(config);
    console.log('📪 User removed from notifications');
    return true;
  }

  console.log('⚠️  User not found in the notifications list');
  return false;
}

module.exports = {
  loadConfig,
  saveConfig,
  reloadConfig,
  isUserMonitored,
  addUserToMonitor,
  removeUserFromMonitor,
  addNotificationRecipient,
  removeNotificationRecipient
};
