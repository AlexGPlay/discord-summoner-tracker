const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const path = require("path");

const { setupDiscord } = require("./discord/setup");
const { startExpressServer } = require("./web/board");
const { setupQueue: setupObserversQueue, addObserverQueue } = require("./queues/addObserverQueue");

const {
  setupQueue: setupRemoveQueue,
  removeObserverQueue,
} = require("./queues/removeObserverQueue");
const {
  setupQueue: setupSummonerQueue,
  trackSummonerQueue,
} = require("./queues/trackSummonerQueue");

(async () => {
  await i18next.use(Backend).init({
    debug: true,
    load: ["es"],
    lng: "es",
    supportedLngs: ["es"],
    fallbackLng: false,
    backend: {
      loadPath: `${path.resolve()}/locales/{{lng}}.json`,
    },
  });

  setupDiscord();
  setupObserversQueue();
  setupRemoveQueue();
  setupSummonerQueue();
  startExpressServer(addObserverQueue, removeObserverQueue, trackSummonerQueue);
})();
