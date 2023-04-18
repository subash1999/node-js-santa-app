require("dotenv").config();

const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoose = require("mongoose");
const User = require("../models/User.model");
const UserProfile = require("../models/UserProfile.model");
const logger = require("../config/logger.config");
const axios = require("axios");
const {formatAPIDateToDateObject} = require("../utils/date.utils");

/**
 * Connect to the mongoose database
 */
const connect = async () => {
  /**
   * Code to
   */
  let uri = process.env.MONGOOSE_URI;
  if (
    process.env.NODE_ENV.toLocaleLowerCase() != "prod" &&
    process.env.NODE_ENV.toLowerCase() != "production"
  ) {
    const mongoServer = await MongoMemoryServer.create();
    uri = await mongoServer.getUri();
  }

  mongoose.connect(uri, { dbName: "santa_app" });
  logger.info(`MongoDB Connected to database uri: ${uri}`);
};

/**
 * Populate the development database User and UserProfile table
 * using the json data retrived form url given in the .env file
 */
const populateDevelopmentDB = async () => {
  const userUrl = process.env.POPULATE_DB_USER_URL;
  const userProfileUrl = process.env.POPULATE_DB_USER_PROFILE_URL;
  // Create a new session for atomic transactions
  const session = await mongoose.startSession();
  session.startTransaction();
  logger.info("populate DB Transaction Session started");
  /**
   * populate the user and user profile data in a single try catch so that if something goes wrong we can roll all back
   */
  try {
    // get the user and user profile data from the url given
    const userResponse = await axios.get(userUrl);
    const userProfileResponse = await axios.get(userProfileUrl);
    let userData = userResponse.data;
    let userProfileData = userProfileResponse.data;

    // create the users
    const users = await User.create(userData);

    // change the user profile data for referencing the user  in user profile
    users.map((user) => {
      const currentUserInData = userData.find(
        (userInData) => userInData.username === user.username
      );
      userProfileData = userProfileData.map(({ userUid, birthdate, ...rest }) =>
        currentUserInData.uid === userUid
          ? {
              user: user,
              birthdate: formatAPIDateToDateObject(birthdate),
              ...rest,
            }
          : {
              userUid,
              birthdate: formatAPIDateToDateObject(birthdate),
              ...rest,
            }
      );
    });

    // create the user profiles
    await UserProfile.create(userProfileData);

    logger.info("DB populated successfully");
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();

    logger.error("populate DB Transaction aborted:" + error.message);
  } finally {
    // End the session
    session.endSession();

    logger.info("populate DB Transaction Session ended");
  }
};

module.exports = {
  connect,
  populateDevelopmentDB,
};
