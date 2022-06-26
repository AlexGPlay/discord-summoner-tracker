const { MessageEmbed } = require("discord.js");
const i18next = require("i18next");

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
    .setTitle(i18next.t("events.startPlaying.title", { summonerName: evt.summoner }))
    .setDescription(
      i18next.t("events.startPlaying.description", {
        championName: evt.participantInfo.champion.name,
      })
    )
    .setThumbnail(
      `http://ddragon.leagueoflegends.com/cdn/12.12.1/img/champion/${evt.participantInfo.champion.image.full}`
    );
}

// { type: 'new-rank', summoner: summonerName, rank: Rank }
function formatNewRank(evt) {
  return new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(i18next.t("events.newRank.title", { summonerName: evt.summoner }))
    .setDescription(i18next.t("events.newRank.description", { queueType: evt.rank.queueType }))
    .addFields({
      name: i18next.t("events.newRank.field1.name"),
      value: `${evt.rank.tier} ${evt.rank.rank}`,
    })
    .setThumbnail(
      `https://opgg-static.akamaized.net/images/medals_new/${evt.to.tier.toLowerCase()}.png`
    );
}

// { type: 'rank-change', summoner: summonerName, from: Rank, to: Rank }
function formatRankChange(evt) {
  return new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(i18next.t("events.rankChange.title", { summonerName: evt.summoner }))
    .setDescription(
      i18next.t("events.rankChange.description", {
        queueType: i18next.t(`queue.${evt.to.queueType}`),
      })
    )
    .addFields({
      name: i18next.t("events.rankChange.field1.name"),
      value: i18next.t("events.rankChange.field1.value.name", {
        from: `${evt.from.tier} ${evt.from.rank}`,
        to: `${evt.to.tier} ${evt.to.rank}`,
      }),
    })
    .setThumbnail(
      `https://opgg-static.akamaized.net/images/medals_new/${evt.to.tier.toLowerCase()}.png`
    );
}

// { type: 'finished-playing', summoner: summonerName, matchId: matchId, summonerData: SummonerData }
function formatFinishedPlaying(evt) {
  return new MessageEmbed()
    .setColor(evt.summonerData.win ? "#32a852" : "#b35050")
    .setTitle(
      i18next.t("events.finishPlaying.title", {
        context: evt.summonerData.win ? "win" : "lose",
        summonerName: evt.summoner,
      })
    )
    .setDescription(
      i18next.t("events.finishPlaying.description", { championName: evt.summonerData.championName })
    )
    .addFields({
      name: i18next.t("events.finishPlaying.field1.name"),
      value: i18next.t("events.finishPlaying.field1.value", {
        kills: evt.summonerData.kills,
        deaths: evt.summonerData.deaths,
        assists: evt.summonerData.assists,
      }),
    })
    .setThumbnail(
      `http://ddragon.leagueoflegends.com/cdn/12.12.1/img/champion/${evt.summonerData.champion.image.full}`
    );
}

module.exports = {
  formatEvents,
};
