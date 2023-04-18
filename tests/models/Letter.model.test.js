const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../models/User.model");
const UserProfile = require("../../models/UserProfile.model");
const Letter = require("../../models/Letter.model");

describe("Letter Model Test", () => {
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
    await Letter.deleteMany({});
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  it("creates and saves a letter successfully", async () => {
    const user = await User.create({
      username: "testuser",
    });

    await UserProfile.create({
      user: user, // create profile for user
      address: "123 Main St",
      birthdate: new Date("2018/02/02"),
    });

    const savedLetter = await Letter.create({
      username: "testuser",
      message: "This is a test letter to Santa.",
    });
    expect(savedLetter._id).toBeDefined();
    expect(savedLetter.username).toBe("testuser");
    expect(savedLetter.message).toBe("This is a test letter to Santa.");
    expect(savedLetter.isEmailSent).toBe(false);
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  it("throws an error when the username is not registered", async () => {
    const letter = new Letter({
      username: "nonexistinguser",
      message: "This is a test letter to Santa.",
    });
    await expect(letter.save()).rejects.toThrow(
      "Sorry but you need to be registered to send a letter to santa"
    );
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  it("throws an error when the user is registered but userprofile is not registered", async () => {
    await User.create({
      username: "testuser",
    });
    const letter = new Letter({
      username: "nonexistinguser",
      message: "This is a test letter to Santa.",
    });
    await expect(letter.save()).rejects.toThrow(
      "Sorry but you need to be registered to send a letter to santa"
    );
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  it("throws an error when the user is too old", async () => {
    const user = await User.create({
      username: "testuser",
    });

    await UserProfile.create({
      user: user, // create profile for user
      address: "123 Main St",
      birthdate: new Date("2008/05/23"),
    });
    const letter = new Letter({
      username: "testuser",
      message: "This is a test letter to Santa.",
    });
    await expect(letter.save()).rejects.toThrow(
      "Sorry but you are too old to send a letter to santa"
    );
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  it("throws an error when username is not given", async () => {
    const user = await User.create({
      username: "testuser",
    });

    await UserProfile.create({
      user: user, // create profile for user
      address: "123 Main St",
      birthdate: new Date("2008/05/23"),
    });
    const letter = new Letter({
      message: "This is a test letter to Santa.",
    });
    await expect(letter.save()).rejects.toThrow(
      "Username is required to send a letter to santa"
    );
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  it("throws an error when message is not given", async () => {
    const user = await User.create({
      username: "testuser",
    });

    await UserProfile.create({
      user: user, // create profile for user
      address: "123 Main St",
      birthdate: new Date("2008/05/23"),
    });
    const letter = new Letter({
      username: "testuser",
    });
    await expect(letter.save()).rejects.toThrow(
      "Message is required to send a letter to santa"
    );
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  it("throws an error when message is more than 100 characters", async () => {
    const user = await User.create({
      username: "testuser",
    });

    await UserProfile.create({
      user: user, // create profile for user
      address: "123 Main St",
      birthdate: new Date("2008/05/23"),
    });
    const letter = new Letter({
      username: "testuser",
      "message": "a".repeat(110)
    });
    await expect(letter.save()).rejects.toThrow(
      "Message cannot be more than 100 characters"
    );
  });
});
