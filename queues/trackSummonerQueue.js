const Queue = require("bull");

const fs = require("fs");
const { updateLocalSummonerInfo } = require("../riot/summoner");
const { formatEvents } = require("../discord/formatEvents");
const client = require("../discord/client");

const trackSummonerQueue = new Queue("trackSummoner");

function setupQueue() {
  trackSummonerQueue.process(async ({ data: { summonerName, repeat } }) => {
    try {
      await trackSummonerFunction({ summonerName });

      if (repeat) {
        if (!fs.existsSync(`./tmp/summoners/${summonerName}.json`)) return;
        const observers = JSON.parse(
          fs.readFileSync(`./tmp/summoners/${summonerName}.json`)
        ).observers;

        if (Object.keys(observers).length === 0) return;

        await trackSummonerQueue.add({ summonerName, repeat: true }, { delay: 60_000 });
      }
    } catch (e) {
      console.error(e);
    }
  });
}

function addJob({ summonerName, repeat }) {
  trackSummonerQueue.add({ summonerName, repeat });
}

async function trackSummonerFunction({ summonerName }) {
  if (!fs.existsSync(`./tmp/summoners/${summonerName}.json`)) return;
  const observers = JSON.parse(fs.readFileSync(`./tmp/summoners/${summonerName}.json`)).observers;
  const events = await updateLocalSummonerInfo(summonerName);
  const formattedEvents = formatEvents(events);

  for (const observer of Object.keys(observers)) {
    const channel = await client.channels.fetch(observer);
    for (const formattedEvt of formattedEvents) await channel.send(formattedEvt);
  }
}

module.exports = { trackSummonerQueue, addJob, setupQueue };
