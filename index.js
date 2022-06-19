const { isSummonerPlaying } = require('./riot/utils');

(async () => {
  const summonerName = "lorensun";
  const isPlaying = await isSummonerPlaying(summonerName);

  console.log(isPlaying);
})();
