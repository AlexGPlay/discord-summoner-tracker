const nodeFetch = require('node-fetch');
const { riotApiKey } = require("../secrets");

const fetch = (url, params) => nodeFetch(url, { ...params, headers: { 'X-Riot-Token': riotApiKey, ...(params?.headers || {}) } });

const getSummonerByName = (name) => resolveFetchRequest(fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`));
const getLeaguesByAccountId = (accountId) => resolveFetchRequest(fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${accountId}`));
const getMatchesByAccountId = (accountId) => resolveFetchRequest(fetch(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`));
const getSpectatorInfoByAccountId = (accountId) => resolveFetchRequest(fetch(`https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${accountId}`));
const getMatchInfoById = (matchId) => resolveFetchRequest(fetch(`https://euw1.api.riotgames.com/lol/match/v4/matches/${matchId}`));

const resolveFetchRequest = (request) => {
  return new Promise((resolve, reject) => {
    request
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(err => reject(err.json()));
  });
}

module.exports = {
  getSummonerByName,
  getLeaguesByAccountId,
  getMatchesByAccountId,
  getSpectatorInfoByAccountId,
  getMatchInfoById
}