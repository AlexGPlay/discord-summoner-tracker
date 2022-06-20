const { getSummonerByName, getMatchesByAccountId, getSpectatorInfoByAccountId, getEntriesByName, getSummonerGames } = require('./api');

const getMatchesBySummonerName = async (summonerName) => {
  const summonerInfo = await getSummonerByName(summonerName);
  return getMatchesByAccountId(summonerInfo.accountId);
}

const isSummonerPlaying = async (summonerName) => {
  try {
    const spectatorInfo = await getCurrentGame(summonerName);
    return !!spectatorInfo?.gameId;
  }
  catch (e) {
    console.error(e);
    return false;
  }
}

const getCurrentGame = async (summonerName) => {
  try {
    const summonerInfo = await getSummonerByName(summonerName);
    return getSpectatorInfoByAccountId(summonerInfo.id);
  }
  catch (e) {
    console.error(e);
    return {};
  }
}

const getSummonerRank = async (summonerName) => {
  try {
    const summonerInfo = await getSummonerByName(summonerName);
    return getEntriesByName(summonerInfo.id);
  } catch (e) {
    console.error(e);
    return false;
  }
}

const getGames = async (summonerName, start = 0, count = 50) => {
  try {
    const summonerInfo = await getSummonerByName(summonerName);
    const matches = await getSummonerGames(summonerInfo.puuid, start, count);
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
  getGames,
  getCurrentGame
}