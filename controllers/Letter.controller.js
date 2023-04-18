const logger = require("../config/logger.config");

const Letter = require("../models/Letter.model");
const User = require("../models/User.model");
const UserProfile = require("../models/UserProfile.model");
const { formatValidationError } = require("../utils/mongoose.util");

/**
 * Controller to validate and create a new letter
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns
 */
const createLetter = async (req, res) => {
  try {
    const { username } = req.body;

    // create letter
    const letter = await Letter.create({ ...req.body });
    logger.info(`letterController: Letter created: ${JSON.stringify(letter)}`);
    return res.status(201).json(letter);
  } catch (error) {
    if (error.name === "ValidationError") {
      logger.info("letterController: validation Error Cannot create letter");
      const formattedError = formatValidationError(error);
      return res
        .status(400)
        .json({ errors: Object.values(formattedError), ...formattedError });
    }
    logger.error("letterController: Cannot create letter");
    logger.error(error);
    return res.status(400).json({ errors: error.message });
  }
};

/**
 * Controller to get all the letters
 * @param {Object} req Request object
 * @param {Object} res Response Object
 * @returns
 */
const getLetters = async (req, res) => {
  const letters = await Letter.find({}).sort({ createdAt: -1 });
  // const users = await userModal.find({ }).sort({ createdAt: -1});
  // const userProfiles = await userProfileModal.find({ }).sort({ createdAt: -1}).populate('user');
  // console.log(letters);
  // console.log(users);
  // console.log(userProfiles);
  return res.status(200).json(letters);
};

module.exports = { createLetter, getLetters };
