const { setupDiscord } = require("./discord/setup");
const { setupQueue: setupObserversQueue } = require("./queues/addObserverQueue");
const { setupQueue: setupRemoveQueue } = require("./queues/removeObserverQueue");
const { setupQueue: setupSummonerQueue } = require("./queues/trackSummonerQueue");

setupDiscord();
setupObserversQueue();
setupRemoveQueue();
setupSummonerQueue();
