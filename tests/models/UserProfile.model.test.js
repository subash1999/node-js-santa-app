const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const UserProfile = require("../../models/UserProfile.model");
const User = require("../../models/User.model");

let mongoServer;
let savedUser;
describe("UserProfile model", () => {
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // SETUP
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    savedUser = await User.create({ username: "testuser" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("save method", () => {
    beforeEach(async () => {
      await UserProfile.deleteMany({});
    });

    afterEach(async () => {
      await UserProfile.deleteMany({});
    });
    // -----------------------------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------------------------

    it("should save a new user profile to the database", async () => {
      const userProfileData = {
        user: savedUser, // create a new ObjectId for the user
        address: "123 Main St",
        birthdate: new Date("1998/02/02"),
      };

      const userProfile = new UserProfile(userProfileData);
      const savedUserProfile = await userProfile.save();

      // Check that the saved user profile matches the original data
      expect(savedUserProfile.user).toEqual(userProfileData.user);
      expect(savedUserProfile.address).toEqual(userProfileData.address);
      expect(savedUserProfile.birthdate).toEqual(userProfileData.birthdate);
    });
    // -----------------------------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------------------------

    it("should throw an error when required fields are missing", async () => {
      const userProfileData = {
        user: savedUser,
      };

      let error;

      try {
        await UserProfile.create(userProfileData);
      } catch (e) {
        error = e;
      }

      // Check that the error message indicates the missing field
      expect(error).toBeDefined();
      expect(error.message).toContain("address: Path `address` is required.");
      expect(error.message).toContain(
        "birthdate: Path `birthdate` is required."
      );
    });
  });
});
