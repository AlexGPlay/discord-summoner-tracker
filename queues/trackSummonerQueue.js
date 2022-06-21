const Queue = require("bull");

const { updateLocalSummonerInfo } = require("../riot/summoner");
const { formatEvents } = require("../discord/formatEvents");
const client = require("../discord/client");

const trackSummonerQueue = new Queue("trackSummoner");

trackSummonerQueue.process(async (job, done) => {
  try {
    await trackSummonerFunction({
      summonerName: job.data.summonerName,
      discordChannel: job.data.discordChannel,
    });

    if (job.data.repeat) {
      await trackSummonerQueue.add(
        { summonerName: job.data.summonerName, discordChannel: job.data.discordChannel, repeat: true },
        { delay: 60_000 }
      );
    }
  } catch (e) {
    console.error(e);
  } finally {
    done();
  }
});

async function trackSummonerFunction({ summonerName, discordChannel }) {
  const events = await updateLocalSummonerInfo(summonerName);
  const formattedEvents = formatEvents(events);

  const channel = await client.channels.fetch(discordChannel);
  for (const formattedEvt of formattedEvents) await channel.send(formattedEvt);
}

module.exports = { trackSummonerQueue, trackSummonerFunction };
