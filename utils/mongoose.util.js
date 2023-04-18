/**
 *
 * @param {MongooseError} err MongooseValidationError
 * @returns Required error object with {key: message} pair
 */
function formatValidationError(err) {
  const errors = {};
  Object.keys(err.errors).forEach((key) => {
    errors[key] = err.errors[key].message;
  });
  return errors;
}

module.exports = { formatValidationError };
