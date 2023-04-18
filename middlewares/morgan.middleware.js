const morgan = require('morgan');
const logger = require("../config/logger.config");

const morganMiddleware = morgan(
    function morganMiddlewareFormatting(tokens, req, res) {
        //  Saving the logs in the json format so that we can easily process the logs for later
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number.parseFloat(tokens.status(req, res)),
            content_length: tokens.res(req, res, 'content-length'),
            responseTime: Number.parseFloat(tokens['response-time'](req, res))
        });
    },
    {
        stream: {
            // configuring the morgan to use our custom logger
            write: (message) => {
                const data = JSON.parse(message);
                logger.http(`Incoming request`, data);
            }
        }
    }
);

module.exports = morganMiddleware;