const moment = require("moment");

/**
 * Calculate the current age of a person given their birth date.
 * @param {string} birthDate
 * @returns
 */
const calculateAge = (birthDate) => {
  const ageDiff = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

/**
 *
 * @param {String} date api date string with the format yyyy/dd/mm
 * @returns {Date}
 */
const formatAPIDateToDateObject = (date) => {
  const formattedDate = moment(date, "YYYY/DD/MM").format("YYYY/MM/DD");
  return new Date(formattedDate);
};

module.exports = { calculateAge, formatAPIDateToDateObject };
