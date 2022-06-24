const Queue = require("bull");
const { addObserver } = require("../riot/summoner");

const addObserverQueue = new Queue("addObserver");

function setupQueue() {
  addObserverQueue.process(({ data: { channelId, summonerName } }) => {
    addObserver(summonerName, channelId);
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
