const express = require("express");

const { createLetter, getLetters } = require("../controllers/Letter.controller");

const letterRoutes = express.Router();

letterRoutes.post("/", createLetter);

letterRoutes.get("/", getLetters);

module.exports = letterRoutes;
