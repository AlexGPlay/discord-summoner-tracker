const { getSummonerByName, getMatchesByAccountId, getSpectatorInfoByAccountId } = require('./api');

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

module.exports = {
  getMatchesBySummonerName,
  isSummonerPlaying
}