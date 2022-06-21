const { trackSummonerQueue } = require("../../queues/trackSummonerQueue");
require("../../jobs/trackSummonerJob");

async function startFollow(msg) {
  const name = msg.content.replace("!follow_summoner ", "");
  await msg.reply(`Started tracking the progress of ${name}`);
  trackSummonerQueue.add({ summonerName: name, discordChannel: msg.channelId, repeat: true });
}

async function updateOnce(msg) {
  const name = msg.content.replace("!update_summoner ", "");
  await msg.reply(`Updated the progress of ${name}`);
  trackSummonerQueue.add({ summonerName: name, discordChannel: msg.channelId, repeat: false });
}

module.exports = {
  startFollow,
  updateOnce,
};
