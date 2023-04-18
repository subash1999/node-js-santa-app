const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const User = require("./User.model");
const UserProfile = require("./UserProfile.model");
// util function to calculate the age
const { calculateAge } = require("../utils/date.utils");
// letterSchema
const letterSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required to send a letter to santa'],
      validate: {
        validator: async function (value) {
         
          // validate if the username exists in the User schema
          const user = await User.findOne({ username: value });
          if (user === null) {
            throw new Error(
              "Sorry but you need to be registered to send a letter to santa"
            );
          }
          const userProfile = await UserProfile.findOne({ user: user });
          if (userProfile === null) {
            throw new Error(
              "Sorry but you need to be registered to send a letter to santa"
            );
          }
          // check if the user's age is greater than 10
          const age = calculateAge(userProfile.birthdate);
          if (age >= 10) {
            throw new Error(
              "Sorry but you are too old to send a letter to santa"
            );
          }
          return true;
        },
      },
    },
    message: {
      type: String,
      maxlength: [100,'Message cannot be more than 100 characters'],
      required: [true, 'Message is required to send a letter to santa'],
    },
    isEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Letter", letterSchema);
