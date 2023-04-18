let cron = require("node-cron");
let nodemailer = require("nodemailer");
require("dotenv").config();
const Letter = require("../models/Letter.model");
const User = require("../models/User.model");
const UserProfile = require("../models/UserProfile.model");
const logger = require("../config/logger.config");
/**
 * Get the mail text to send to the santa
 */
const getPendingLetters = async () => {
  let pendingLetters = [];
  const letters = await Letter.find({ isEmailSent: false }).lean().exec();
  // find user and user profile for all pending letters
  for (const letter of letters) {
    // get user who wrote the letter using username
    const user = await User.findOne({ username: letter.username });
    // checking for data consistency
    if (!user) {
      logger.error(
        `User not found for a letter with username: ${letter.username} sending e-mail`
      );
      return;
    }
    // get the profile of the usr who wrote the letter
    const userProfile = await UserProfile.findOne({ user: user });
    // checking for data consistency
    if (!userProfile) {
      logger.error(
        `User Profile not found for a letter with username: ${letter.username} sending e-mail`
      );
      return;
    }
    // include letter id in the email content so that we can make isEmailSent true after email is sent
    const emailContent = {
      id: letter._id,
      username: letter.username,
      address: userProfile.address,
      message: letter.message,
    };
    pendingLetters.push(emailContent);
  }

  return pendingLetters;
};

/**
 * set isEmailSent true for all pending letters after email is sent
 */
const setIsEmailSentTrue = async (pendingLetters) => {
  for (const letter of pendingLetters) {
    await Letter.findOneAndUpdate(
      { _id: letter.id }, 
       { $set: { isEmailSent: true } },
      { new: true });
  }
};

/**
 *
 * @param {Object} pendingLetters {username,address,message}
 * @returns {string} email content
 */
const getEmailText = (pendingLetters) => {
  let emailContent = "";
  emailContent += `Hello Santa\n\n`;
  emailContent += `There are ${pendingLetters.length} pending from your beloved children letters.\n\n`;
  emailContent += `Please see the list below.\n`;
  emailContent += `\n\nUsername - Address - Message\n\n`;
  pendingLetters.map((letter) => {
    emailContent += `\n${letter.username} - ${letter.address} - ${letter.message}\n`;
  });
  emailContent += `\n\nChildren are waiting for you Santa`;
  return emailContent;
};

/**
 * Send the email to the santa
 */
const sendEmail = async (subject, text) => {
  // e-mail message options
  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_FROM,
    subject,
    text,
  };

  // email transport SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.ETHEREAL_USER, // generated ethereal user
      pass: process.env.ETHEREAL_PASS, // generated ethereal password
    },
  });
  // Send e-mail
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      logger.erorr(error);
    } else {
      logger.info("Email sent to santa :" + info.response);
    }
  });
};
// corn schedule to send e-mail every 15 seconds
const sendMailToSantaEvery15SecTask = cron.schedule(
  "*/15 * * * * *",
  async () => {
    try {
      const pendingLetters = await getPendingLetters();
      if (pendingLetters.length > 0) {
        const text = getEmailText(pendingLetters);
        await sendEmail(
          pendingLetters.length + " Pending Letters From Children To Santa",
          text
        );
        await setIsEmailSentTrue(pendingLetters);
        logger.info(
          "Sent e-mail for pending letters from children to santa after checking every 15 seconds"
        );
      }
    } catch (err) {
      logger.error("Error while Sending e-mail to santa every 15 seconds");
      logger.error(err.message);
    }
  }
);

module.exports = sendMailToSantaEvery15SecTask;
