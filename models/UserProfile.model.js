const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
},{timestamps: true});

module.exports =  mongoose.model("UserProfile", userProfileSchema);
