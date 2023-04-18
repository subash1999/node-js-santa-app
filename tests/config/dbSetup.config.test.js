const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../models/User.model");
const UserProfile = require("../../models/UserProfile.model");
const { populateDevelopmentDB } = require("../../config/dbSetup.config");
describe("populateUserData", () => {
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // SETUP
  // -----------------------------------------------------------------------------------------------------------------------------------------------

  let mongoServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  beforeEach(async () => {
    await User.deleteMany({});
    await UserProfile.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
    await UserProfile.deleteMany({});
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------

  it("should populate user and user profile data", async () => {
    // Set the environment variables
    process.env.POPULATE_DB_USER_URL =
      "https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json";
    process.env.POPULATE_DB_USER_PROFILE_URL =
      "https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json";

    // Call the function to populate user and user profile data
    await populateDevelopmentDB();

    // Retrieve the user and user profile data from the database
    const users = await mongoose.model("User").find();
    const userProfiles = await mongoose.model("UserProfile").find();

    // Verify that there are 3 records in the user and user profile tables
    expect(users.length).toEqual(3);
    expect(userProfiles.length).toEqual(3);
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------
});
