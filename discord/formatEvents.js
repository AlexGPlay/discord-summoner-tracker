const { MessageEmbed } = require("discord.js");
const fs = require("fs");

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
  return new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${evt.summoner} - Partida empezada`)
    .setDescription(`Jugando con ${evt.participantInfo.champion.name}`)
    .setThumbnail(
      `http://ddragon.leagueoflegends.com/cdn/12.12.1/img/champion/${evt.participantInfo.champion.image.full}`
    );
}

// { type: 'new-rank', summoner: summonerName, rank: Rank }
function formatNewRank(evt) {
  return new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${evt.summoner} - Nuevo rango`)
    .setDescription(`Se ha posicionado en ${evt.rank.queueType}`)
    .addFields({ name: "Posicionado en", value: `${evt.rank.tier} ${evt.rank.rank}` })
    .setThumbnail(
      `https://opgg-static.akamaized.net/images/medals_new/${evt.to.tier.toLowerCase()}.png`
    );
}

// { type: 'rank-change', summoner: summonerName, from: Rank, to: Rank }
function formatRankChange(evt) {
  return new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${evt.summoner} - Cambio de rango`)
    .setDescription(`Ha cambiado de rango en ${evt.to.queueType}`)
    .addFields({
      name: "Promoted/Demoted",
      value: `${evt.from.tier} ${evt.from.rank} => ${evt.to.tier} ${evt.to.rank}`,
    })
    .setThumbnail(
      `https://opgg-static.akamaized.net/images/medals_new/${evt.to.tier.toLowerCase()}.png`
    );
}

// { type: 'finished-playing', summoner: summonerName, matchId: matchId, summonerData: SummonerData }
function formatFinishedPlaying(evt) {
  return new MessageEmbed()
    .setColor(evt.summonerData.win ? "#32a852" : "#b35050")
    .setTitle(`${evt.summoner} - ${evt.summonerData.win ? "VICTORIA" : "DERROTA"}`)
    .setDescription(`Partida terminada con ${evt.summonerData.champion.name}`)
    .addFields({
      name: "Puntuación (K/D/A)",
      value: `${evt.summonerData.kills}/${evt.summonerData.deaths}/${evt.summonerData.assists}`,
    })
    .setThumbnail(
      `http://ddragon.leagueoflegends.com/cdn/12.12.1/img/champion/${evt.summonerData.champion.image.full}`
    );
}

module.exports = {
  formatEvents,
};
