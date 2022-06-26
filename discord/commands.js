const { SlashCommandBuilder } = require("@discordjs/builders");

const commands = [
  new SlashCommandBuilder()
    .setName("follow")
    .setDescription("Follow a summoner")
    .addStringOption((option) =>
      option
        .setName("summoner")
        .setDescription("Summoner name you want to follow")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("unfollow")
    .setDescription("Unfollow a summoner")
    .addStringOption((option) =>
      option.setName("summoner").setDescription("Summoner you want to unfollow").setRequired(true)
    ),
].map((command) => command.toJSON());

module.exports = {
  commands,
};
