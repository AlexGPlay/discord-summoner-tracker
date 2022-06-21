const { startFollow, updateOnce } = require("./actions/follow");
const client = require("./client");

function setupDiscord() {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("hogos", { type: "WATCHING" });
  });

  client.on("messageCreate", async (msg) => {
    if (msg.content.startsWith("!follow_summoner")) startFollow(msg);
    else if (msg.content.startsWith("!update_summoner")) updateOnce(msg);
  });
}

module.exports = {
  setupDiscord,
};
