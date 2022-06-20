const { discordApiKey } = require("../secrets");
const Discord = require("discord.js");


const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILD_MESSAGES] });

client.login(discordApiKey);

module.exports = client;
