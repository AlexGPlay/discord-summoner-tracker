const fs = require("fs");

const { discordApiKey, riotApiKey } = JSON.parse(fs.readFileSync("./settings.json"));

module.exports = {
  discordApiKey,
  riotApiKey
}