const container = require("./src/system/Container");

function start() {
  container.initApp().then((app) => {
    app.start().catch((error) => {
      let errorStack = null;
      if (app.server.config.local || app.server.config.development) {
        errorStack = `\r\n${error.start}`;
      }

      app.server.logger.error("Unhandled App error", {
        data: {
          errorMessage: error.toString(),
          errorStack,
        },
      });
      process.exit(1);
    });
  });
}

start();
