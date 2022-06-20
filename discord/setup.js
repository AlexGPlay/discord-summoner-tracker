const client = require('./client');

function setupDiscord() {

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("hogos", { type: "WATCHING" });
  });

  client.on("message", async (msg) => {
    if (msg.content.startsWith("!follow_summoner"))
      console.log(msg.content);
  });

}

module.exports = {
  setupDiscord
}