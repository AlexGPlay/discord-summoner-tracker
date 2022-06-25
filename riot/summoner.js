const {
  isSummonerPlaying,
  getSummonerRank,
  getGames,
  getCurrentGame,
  getChampionById,
} = require("./utils");

const { getMatchInfoById } = require("./api");

const { generateSpectatorFile } = require("./spectator");
const fs = require("fs");

async function getSummonerInfo(summonerName) {
  const isPlaying = await isSummonerPlaying(summonerName);
  const lastGames = await getGames(summonerName);
  const rank = await getSummonerRank(summonerName);
  let spectatorFile = null;
  let currentGameInfo = null;

  if (isPlaying) {
    currentGameInfo = await getCurrentGame(summonerName);
    if (currentGameInfo?.observers?.encryptionKey) {
      spectatorFile = generateSpectatorFile({
        gameId: currentGameInfo.gameId,
        observerKey: currentGameInfo?.observers?.encryptionKey,
      });
    }
  }

  return {
    isPlaying,
    lastGames,
    rank,
    spectatorFile,
    currentGameInfo,
  };
}

function getLocalSummonerInfo(summonerName) {
  if (!fs.existsSync(`./tmp/summoners/${encodeURI(summonerName)}.json`)) return null;
  return JSON.parse(fs.readFileSync(`./tmp/summoners/${encodeURI(summonerName)}.json`));
}

function saveInfoFromServer(summonerName, summonerInfo) {
  fs.mkdirSync("./tmp/summoners", { recursive: true });
  const file = `./tmp/summoners/${encodeURI(summonerName)}.json`;

  let currentData = {};
  if (fs.existsSync(file)) currentData = JSON.parse(fs.readFileSync(file));

  fs.writeFileSync(
    file,
    JSON.stringify({
      observers: {},
      ...currentData,
      isPlaying: summonerInfo.isPlaying,
      lastGames: summonerInfo.lastGames,
      rank: summonerInfo.rank,
    })
  );
}

function addObserver(summonerName, channelId) {
  let currentData = {
    observers: {},
  };
  let createObserver = false;
  const file = `./tmp/summoners/${encodeURI(summonerName)}.json`;
  if (fs.existsSync(file)) currentData = JSON.parse(fs.readFileSync(file));

  if (!!currentData.observers[channelId]) return;
  if (Object.keys(currentData.observers).length === 0) createObserver = true;

  currentData.observers[channelId] = { lastMessage: null };
  fs.mkdirSync("./tmp/summoners", { recursive: true });
  fs.writeFileSync(file, JSON.stringify(currentData));

  return createObserver;
}

function removeObserver(summonerName, channelId) {
  const file = `./tmp/summoners/${encodeURI(summonerName)}.json`;
  if (!fs.existsSync(file)) return;

  let currentData = JSON.parse(fs.readFileSync(file));
  delete currentData.observers[channelId];

  fs.writeFileSync(file, JSON.stringify(currentData));
}

async function updateLocalSummonerInfo(summonerName) {
  const summonerInfo = await getSummonerInfo(summonerName);
  const localSummonerInfo = getLocalSummonerInfo(summonerName);

  if (!localSummonerInfo || Object.keys(localSummonerInfo).length < 2) {
    saveInfoFromServer(summonerName, summonerInfo);
    return [];
  }

  let events = [];

  const hasStartedPlaying = summonerInfo.isPlaying && !localSummonerInfo.isPlaying;
  if (hasStartedPlaying) {
    const participantInfo = summonerInfo.currentGameInfo.participants.find(
      (participant) => participant.summonerName === summonerName
    );

    const championInfo = await getChampionById(participantInfo.championId);

    events.push({
      type: "start-playing",
      summoner: summonerName,
      participantInfo: { ...participantInfo, champion: championInfo },
    });
  }

  summonerInfo.rank.forEach((rank) => {
    const localRank = localSummonerInfo.rank.find(
      (tmpRank) => tmpRank.queueType === rank.queueType
    );
    if (!localRank) return events.push({ type: "new-rank", summoner: summonerName, rank: rank });

    if (localRank.tier === rank.tier && localRank.rank === rank.rank) return;

    events.push({ type: "rank-change", summoner: summonerName, from: localRank, to: rank });
  });

  const alreadyPlayedGamesDifference = summonerInfo.lastGames.filter(
    (game) => !localSummonerInfo.lastGames.includes(game)
  );
  if (alreadyPlayedGamesDifference.length > 0) {
    const requestedGames = await Promise.all(
      alreadyPlayedGamesDifference.map((game) => getMatchInfoById(game))
    );
    requestedGames.forEach((game) => {
      const summonerData = game.info.participants.find(
        (participant) =>
          participant.summonerName.trim().toLowerCase() === summonerName.trim().toLowerCase()
      );
      events.push({
        type: "finished-playing",
        summoner: summonerName,
        matchId: game.metadata.matchId,
        summonerData,
      });
    });
  }

  saveInfoFromServer(summonerName, summonerInfo);
  return events;
}

module.exports = {
  updateLocalSummonerInfo,
  addObserver,
  removeObserver,
};
