const { discordApiKey } = require("../secrets");
const Discord = require("discord.js");

const IGNORE_INTENTS = [Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS];

const client = new Discord.Client({
  intents: Object.values(Discord.Intents.FLAGS).filter(
    (intent) => !IGNORE_INTENTS.includes(intent)
  ),
});

client.login(discordApiKey);

module.exports = client;
