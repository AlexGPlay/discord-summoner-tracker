const Queue = require("bull");
const { removeObserver } = require("../riot/summoner");

const removeObserverQueue = new Queue("removeObserver");

function setupQueue() {
  removeObserverQueue.process(({ data: { channelId, summonerName } }) => {
    removeObserver(summonerName, channelId);
  });
}

function addJob({ channelId, summonerName }) {
  removeObserverQueue.add({ channelId, summonerName });
}

module.exports = {
  removeObserverQueue,
  setupQueue,
  addJob,
};
