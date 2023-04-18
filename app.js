const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser.json());

// morgan middleware to handle HTTP requests logging
const morganMiddleware = require("./middlewares/morgan.middleware");
app.use(morganMiddleware);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// routes
//routes for the letters
const letterRoutes = require("./routes/letter.routes");
app.use("/api/letters", letterRoutes);

module.exports = app;