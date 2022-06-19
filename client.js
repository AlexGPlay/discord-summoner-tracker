const { discordApiKey } = require("secrets");
const Discord = require("discord.js");
const client = new Discord.Client();

client.login(discordApiKey);

module.exports = client;
