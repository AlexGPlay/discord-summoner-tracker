const {
  startFollow,
  updateOnce,
  stopFollow,
  startFollowCommand,
  stopFollowCommand,
} = require("./actions/follow");
const client = require("./client");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { commands } = require("./commands");
const { discordToken } = require("../secrets");

function setupDiscord() {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("hogos", { type: "WATCHING" });
  });

  client.on("interactionCreate", async (interaction) => {
    const { commandName } = interaction;
    if (commandName === "follow") startFollowCommand(interaction);
    else if (commandName == "unfollow") stopFollowCommand(interaction);
  });

  client.on("messageCreate", async (msg) => {
    if (msg.content.startsWith("!follow_summoner")) startFollow(msg);
    else if (msg.content.startsWith("!unfollow_summoner")) stopFollow(msg);
    else if (msg.content.startsWith("!update_summoner")) updateOnce(msg);
  });

  const rest = new REST({ version: "9" }).setToken(
    "OTg4MTcxNzM5OTcwMjg1NjI4.GsngfP.oL56NOZ9v1T0vDl4zQNGzw65q0L3BvsbYKWDsE"
  );

  rest
    .put(Routes.applicationCommands(discordToken, "267650732549734410"), {
      body: commands,
    })
    .then(() => console.log("Success"))
    .catch(console.error);
}

module.exports = {
  setupDiscord,
};
