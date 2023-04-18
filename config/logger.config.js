require("dotenv").config();
const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint, json } = format;
const DailyRotateFile = require("winston-daily-rotate-file");

// log folder prod in production mode and dev in other modes
const logFolder =
  process.env.NODE_ENV.toLowerCase() !== "prod" &&
  process.env.NODE_ENV.toLowerCase() !== "production"
    ? "dev"
    : "prod";

//DailyRotateFile for the errors func()
const fileRotateTransportError = new DailyRotateFile({
  filename: "logs/" + logFolder + "/error-rotate-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  level: "error",
});

// DailyRotateFile for the all logs
const fileRotateTransportCombined = new DailyRotateFile({
  filename: "logs/" + logFolder + "/all-rotate-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

const logger = createLogger({
  level: "debug",
  format: combine(
    label({ label: "Santa APP" }),
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),

    prettyPrint()
  ),

  transports: [fileRotateTransportError, fileRotateTransportCombined],
});

/**
 If we're not in production then log to the console with the format:
 ${info.level}: ${info.message} JSON.stringify({ ...rest }) 
*/
if (
  process.env.NODE_ENV.toLowerCase() !== "prod" &&
  process.env.NODE_ENV.toLowerCase() !== "production"
) {
  logger.add(new transports.Console());
}

module.exports = logger;
