const { isSummonerPlaying, getSummonerRank, getGames, getCurrentGame } = require('./utils');
const { getMatchInfoById } = require('./api');

const { generateSpectatorFile } = require('./spectator');
const fs = require('fs');

async function getSummonerInfo(summonerName) {
  const isPlaying = await isSummonerPlaying(summonerName);
  const lastGames = await getGames(summonerName);
  const rank = await getSummonerRank(summonerName);
  let spectatorFile = null;

  if (isPlaying) {
    const currentGameInfo = await getCurrentGame(summonerName);
    spectatorFile = generateSpectatorFile({ gameId: currentGameInfo.gameId, observerKey: currentGameInfo.observers.encryptionKey });
  }

  return {
    isPlaying,
    lastGames,
    rank,
    spectatorFile
  }
}

function getLocalSummonerInfo(summonerName) {
  if (!fs.existsSync(`./tmp/summoners/${encodeURI(summonerName)}.json`)) return null;
  return JSON.parse(fs.readFileSync(`./tmp/summoners/${encodeURI(summonerName)}.json`));
}

function saveInfoFromServer(summonerName, summonerInfo) {
  fs.mkdirSync('./tmp/summoners', { recursive: true });
  fs.writeFileSync(`./tmp/summoners/${encodeURI(summonerName)}.json`, JSON.stringify({
    isPlaying: summonerInfo.isPlaying,
    lastGames: summonerInfo.lastGames,
    rank: summonerInfo.rank
  }));
}

async function updateLocalSummonerInfo(summonerName) {
  const summonerInfo = await getSummonerInfo(summonerName);
  const localSummonerInfo = getLocalSummonerInfo(summonerName);

  if (!localSummonerInfo) {
    saveInfoFromServer(summonerName, summonerInfo);
    return [];
  }

  let events = [];

  const hasStartedPlaying = summonerInfo.isPlaying && !localSummonerInfo.isPlaying;
  if (hasStartedPlaying) {
    events.push({ type: 'start-playing', summoner: summonerName });
  }

  const hasDemotedOrPromoted = localSummonerInfo.rank.tier !== summonerInfo.rank.tier || localSummonerInfo.rank.rank !== summonerInfo.rank.rank;
  if (hasDemotedOrPromoted) {
    events.push({ type: 'rank-change', summoner: summonerName, rank: { from: localSummonerInfo.rank, to: summonerInfo.rank } });
  }

  const alreadyPlayedGamesDifference = summonerInfo.lastGames.filter(game => !localSummonerInfo.lastGames.includes(game));
  if (alreadyPlayedGamesDifference.length > 0) {
    const requestedGames = await Promise.all(alreadyPlayedGamesDifference.map(game => getMatchInfoById(game)));
    requestedGames.forEach(game => {
      const summonerData = game.info.participants.find(participant => participant.summonerName.trim().toLowerCase() === summonerName.trim().toLowerCase());
      events.push({ type: 'finished-playing', summoner: summonerName, matchId: game.metadata.matchId, summonerData });
    });
  }

  saveInfoFromServer(summonerName, summonerInfo);
  return events;
}

module.exports = {
  updateLocalSummonerInfo
}