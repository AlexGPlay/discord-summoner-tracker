const { addJob: addObserverQueueJob } = require("../../queues/addObserverQueue");
const { addJob: addRemoveObserverQueueJob } = require("../../queues/removeObserverQueue");

async function startFollow(msg) {
  const name = msg.content.replace("!follow_summoner ", "");
  await msg.reply(`Started tracking the progress of ${name}`);
  addObserverQueueJob({ channelId: msg.channelId, summonerName: name });
}

async function stopFollow(msg) {
  const name = msg.content.replace("!unfollow_summoner ", "");
  await msg.reply(`Stopped tracking the progress of ${name}`);
  addRemoveObserverQueueJob({ channelId: msg.channelId, summonerName: name });
}

async function updateOnce(msg) {
  const name = msg.content.replace("!update_summoner ", "");
  await msg.reply(`Updated the progress of ${name}`);
  addTrackSummonerJob({ summonerName: name, repeat: false });
}

module.exports = {
  startFollow,
  stopFollow,
  updateOnce,
};
