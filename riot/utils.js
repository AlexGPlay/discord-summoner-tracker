const { getSummonerByName, getMatchesByAccountId, getSpectatorInfoByAccountId, getEntriesByName } = require('./api');

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
    return entries.map(entry => `${entry.queueType}: ${entry.tier} ${entry.rank} ${entry.leaguePoints}LP\n`).join('');
  } catch (e) {
    console.error(e);
    return false;
  }
}

module.exports = {
  getMatchesBySummonerName,
  isSummonerPlaying,
  getSummonerRank
}