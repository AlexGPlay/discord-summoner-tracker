const FORMAT_TYPE_FN = {
  "start-playing": formatStartPlaying,
  "new-rank": formatNewRank,
  "rank-change": formatRankChange,
  "finished-playing": formatFinishedPlaying,
};

function formatEvents(events) {
  return events.map((event) => FORMAT_TYPE_FN[event.type](event));
}

// { type: 'start-playing', summoner: summonerName }
function formatStartPlaying(evt) {
  return `${evt.summoner} acaba de empezar a jugar una partida con ${evt.participantInfo.champion.name}`;
}

// { type: 'new-rank', summoner: summonerName, rank: Rank }
function formatNewRank(evt) {
  return `${evt.summoner} acaba de posicionarse en el modo ${evt.rank.queueType} ${evt.rank.tier} ${evt.rank.rank}`;
}

// { type: 'rank-change', summoner: summonerName, from: Rank, to: Rank }
function formatRankChange(evt) {
  return `${evt.summoner} acaba de cambiar de liga en el modo ${evt.to.queueType}, de ser ${evt.from.tier} ${evt.from.rank} ha pasado a ser ${evt.to.tier} ${evt.to.rank}`;
}

// { type: 'finished-playing', summoner: summonerName, matchId: matchId, summonerData: SummonerData }
function formatFinishedPlaying(evt) {
  return `${evt.summoner} acaba de ${evt.summonerData.win ? "GANAR" : "PERDER"} una partida de ${
    evt.summonerData.teamPosition
  } con ${evt.summonerData.championName} y ha quedado ${evt.summonerData.kills}/${
    evt.summonerData.deaths
  }/${evt.summonerData.assists}`;
}

module.exports = {
  formatEvents,
};
