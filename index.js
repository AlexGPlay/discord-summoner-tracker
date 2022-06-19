const { isSummonerPlaying, getSummonerRank, getGames } = require('./riot/utils');

(async () => {
  const summonerName = "PGenius";
  const isPlaying = await isSummonerPlaying(summonerName);
  console.log(isPlaying);

  const rank = await getSummonerRank(summonerName);
  console.log(rank)

  const games = await getGames(summonerName);
  console.log(games);

})();
