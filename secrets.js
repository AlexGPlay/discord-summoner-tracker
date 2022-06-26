const fs = require("fs");

const { discordApiKey, riotApiKey, discordToken } = JSON.parse(fs.readFileSync("./settings.json"));

module.exports = {
  discordApiKey,
  riotApiKey,
  discordToken,
};
