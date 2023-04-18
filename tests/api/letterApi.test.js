const request = require("supertest");
const express = require("express");
const app = require("../../app");
const mongoose = require("mongoose");
const User = require("../../models/User.model");
const UserProfile = require("../../models/UserProfile.model");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Letter = require("../../models/Letter.model");

describe("Letter API", () => {
  let testUser, testUserProfile, mongoServer;

  beforeAll(async () => {
    // Connect to test database
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user and user profile
    testUser = await User.create({
      username: "testuser",
    });

    testUserProfile = await UserProfile.create({
      user: testUser,
      address: "test address",
      birthdate: new Date("2020-04-18"),
    });
  });

  afterAll(async () => {
    // Delete test data and disconnect from test database
    await User.deleteMany({});
    await UserProfile.deleteMany({});
    await Letter.deleteMany({});
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------

  describe("POST /api/letters", () => {
    it("should create a new letter successfully if all validation checks pass", async () => {
      console.log(await User.find({}));
      const response = await request(app)
        .post("/api/letters/")
        .set("Accept", "application/json")
        .send({
          username: "testuser",
          message: "Dear Santa, please bring me a new bike for Christmas!",
        })
        .expect(201);

      // Check that the response matches the created letter
      expect(response.body.username).toEqual("testuser");
      expect(response.body.message).toEqual(
        "Dear Santa, please bring me a new bike for Christmas!"
      );
      expect(response.body.isEmailSent).toEqual(false);
    });
    // -----------------------------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------------------------

    it("should return a 400 error if the user is not registered", async () => {
      const response = await request(app)
        .post("/api/letters")
        .send({
          username: "nonexistentuser",
          message: "Dear Santa, I've been very good this year!",
        })
        .expect(400);

      // Check that the error message matches the expected message
      expect(response.body.username).toEqual(
        "Sorry but you need to be registered to send a letter to santa"
      );
    });

    // -----------------------------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------------------------

    it("should return a 400 error if the user is over 10 years old", async () => {
      // Create a test user and user profile over 10 years old
      const overAgeUser = await User.create({
        username: "overageuser",
      });

      const overAgeUserProfile = await UserProfile.create({
        user: overAgeUser,
        address: "testaddress",
        birthdate: new Date("2010-04-18"),
      });

      const response = await request(app)
        .post("/api/letters")
        .send({
          username: "overageuser",
          message: "Dear Santa, please bring me a new phone for Christmas!",
        })
        .expect(400);

      // Check that the error message matches the expected message
      expect(response.body.username).toEqual(
        "Sorry but you are too old to send a letter to santa"
      );

      // Delete the test user and user profile
      await UserProfile.findOneAndDelete({ _id: overAgeUserProfile._id });
      await User.deleteOne({ _id: overAgeUser._id });
    });
    // -----------------------------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------------------------

    it("should return a 400 error if message is not provided", async () => {
      const letterData = {
        username: "testuser",
      };
      const response = await request(app).post("/api/letters").send(letterData);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Message is required to send a letter to santa"
      );
    });
    // -----------------------------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------------------------

    it("should return a 400 error if username is not provided", async () => {
      const letterData = {
        message: "Dear Santa, I have been very good this year!",
      };
      const response = await request(app).post("/api/letters").send(letterData);
      expect(response.status).toBe(400);
      expect(response.body.username).toBe(
        "Username is required to send a letter to santa"
      );
    });
  });
  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------------------------
});
