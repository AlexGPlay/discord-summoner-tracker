const { getSummonerByName, getMatchesByAccountId, getSpectatorInfoByAccountId, getEntriesByName,getSummonerGames } = require('./api');

const getMatchesBySummonerName = async (summonerName) => {
  const summonerInfo = await getSummonerByName(summonerName);
  return getMatchesByAccountId(summonerInfo.accountId);
}

const isSummonerPlaying = async (summonerName) => {
  try {
    const summonerInfo = await getSummonerByName(summonerName);
    const spectatorInfo = await getSpectatorInfoByAccountId(summonerInfo.id);
    return !!spectatorInfo?.gameId;
  }
  catch (e) {
    console.error(e);
    return false;
  }
}

const getSummonerRank = async (summonerName) => {
  try {
    const summonerInfo = await getSummonerByName(summonerName);
    const entries = await getEntriesByName(summonerInfo.id);
    return entries.map(entry => 
      `${entry.queueType}: ${entry.tier} ${entry.rank} ${entry.leaguePoints}LP \n\t ${entry.wins}W/${entry.losses}L)\n`).join('');
  } catch (e) {
    console.error(e);
    return false;
  }
}

const getGames = async (summonerName) => {
  try {
    const summonerInfo = await getSummonerByName(summonerName);
    const matches = await getSummonerGames(summonerInfo.puuid,0,50);
    return matches;
  } catch (e) {
    console.error(e);
    return false;
  }

}

module.exports = {
  getMatchesBySummonerName,
  isSummonerPlaying,
  getSummonerRank,
  getGames
}