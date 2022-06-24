const express = require("express");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");

function startExpressServer(...queues) {
  const serverAdapter = new ExpressAdapter();
  createBullBoard({
    queues: queues.map((queue) => new BullAdapter(queue)),
    serverAdapter: serverAdapter,
  });

  const app = express();

  serverAdapter.setBasePath("/bull");
  app.use("/bull", serverAdapter.getRouter());

  app.listen(3000, () => {
    console.log("Express running on port 3000");
  });
}

module.exports = {
  startExpressServer,
};
