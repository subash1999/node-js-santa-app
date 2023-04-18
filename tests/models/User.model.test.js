const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../models/User.model");
describe("UserModel", () => {
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
  });

  afterEach(async () => {
    await User.deleteMany({});
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------

  it("should save a user", async () => {
    const user = new User({ username: "testuser" });
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe("testuser");
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------

  it("should not save a user with duplicate username", async () => {
    const user1 = new User({ username: "testuser" });
    await user1.save();
    const user2 = new User({ username: "testuser" });
    await expect(user2.save()).rejects.toThrow("E11000 duplicate key error");
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------

  it("should require username", async () => {
    const user = new User({});
    await expect(user.save()).rejects.toThrow(/username.*required/);
  });
});
