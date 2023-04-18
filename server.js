// server.js
// where your node app starts

// init project
require("dotenv").config();
const app = require("./app");
const logger = require("./config/logger.config");
const sendMailToSantaEvery15SecTask = require("./tasks/sendMailToSantaEvery15Sec.task");

// Connect to the database
const { connect, populateDevelopmentDB } = require("./config/dbSetup.config");

connect()
  .then(() => {
    // If not in production, populate development DB
    if (
      process.env.NODE_ENV.toLowerCase() !== "prod" &&
      process.env.NODE_ENV.toLowerCase() !== "production"
    ) {
      populateDevelopmentDB()
        .then(() => {
          // Start server
          const listener = app.listen(process.env.PORT || 3000, function () {
            logger.info(
              "Your app is listening on port " + listener.address().port
            );
          });
        })
        .catch((error) => {
          logger.error(error);
        });
    }
    // Otherwise start server without populating DB
    else {
      const listener = app.listen(process.env.PORT || 3000, function () {
        logger.info("Your app is listening on port " + listener.address().port);
      });
    }
  })
  .catch((error) => {
    logger.error(error);
  });
