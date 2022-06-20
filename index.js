const { setupDiscord } = require('./discord/setup');

// const { updateLocalSummonerInfo } = require('./riot/summoner');

// (async () => {
//   const summonerName = "Raistm";
//   let events = await updateLocalSummonerInfo(summonerName);
//   console.log(events);
// })();

setupDiscord();