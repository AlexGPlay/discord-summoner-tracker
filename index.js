const { setupDiscord } = require("./discord/setup");
const { startExpressServer } = require("./web/board");
const { setupQueue: setupObserversQueue, addObserverQueue } = require("./queues/addObserverQueue");
const {
  setupQueue: setupRemoveQueue,
  removeObserverQueue,
} = require("./queues/removeObserverQueue");
const {
  setupQueue: setupSummonerQueue,
  trackSummonerQueue,
} = require("./queues/trackSummonerQueue");

setupDiscord();
setupObserversQueue();
setupRemoveQueue();
setupSummonerQueue();
startExpressServer(addObserverQueue, removeObserverQueue, trackSummonerQueue);
