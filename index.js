const { isSummonerPlaying, getSummonerRank } = require('./riot/utils');

(async () => {
  const summonerName = "PGenius";
  const isPlaying = await isSummonerPlaying(summonerName);

  const rank = await getSummonerRank(summonerName);
  console.log(rank)
  console.log(isPlaying);
})();
