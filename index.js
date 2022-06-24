const { setupDiscord } = require("./discord/setup");
<<<<<<< HEAD

// const { updateLocalSummonerInfo } = require('./riot/summoner');

// (async () => {
//   const summonerName = "Raistm";
//   let events = await updateLocalSummonerInfo(summonerName);
//   console.log(events);
// })();

setupDiscord();
=======
const { setupQueue: setupObserversQueue } = require("./queues/addObserverQueue");
const { setupQueue: setupRemoveQueue } = require("./queues/removeObserverQueue");
const { setupQueue: setupSummonerQueue } = require("./queues/trackSummonerQueue");

setupDiscord();
setupObserversQueue();
setupRemoveQueue();
setupSummonerQueue();
>>>>>>> aa9b721689b6afd556c9329b21c86ea59d9d85d1
