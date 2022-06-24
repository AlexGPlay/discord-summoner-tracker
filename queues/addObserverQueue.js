const Queue = require("bull");
const { addObserver } = require("../riot/summoner");
const { addJob: addTrackSummonerJob } = require("../queues/trackSummonerQueue");

const addObserverQueue = new Queue("addObserver");

function setupQueue() {
  addObserverQueue.process(({ data: { channelId, summonerName } }) => {
    let observer = addObserver(summonerName, channelId);
    if (observer) addTrackSummonerJob({ summonerName, repeat: true });
  });
}

function addJob({ channelId, summonerName }) {
  addObserverQueue.add({ channelId, summonerName });
}

module.exports = {
  addObserverQueue,
  setupQueue,
  addJob,
};
