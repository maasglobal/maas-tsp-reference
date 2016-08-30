'use strict';

/**
 * Validate the event data
 * @param {object} event - The event data from the event
 * @returns {Promise} A promise that resolves with the original event
 */
const validateEventData = event => (
  new Promise((resolve, reject) => {
    if (!event.tspId) {
      return reject(new Error('400: tspId is required'));
    }

    return resolve(event);
  })
);

/**
 * Format a response that conforms to the TSP booking-cancel response schema
 */
function formatResponse(event) {
  return Promise.resolve({
    state: 'CANCELLED',
  });
}

/**
 * Booking cancel responder
 * @param {object} event
 * @param {function} callback
 * @returns {Promise} A promise that lastly calls `callback` with the TSP response
 */
const cancel = (event, callback) => {
  return validateEventData(event)
    .then(validatedEvent => formatResponse(validatedEvent))
    .then(result => callback(null, result))
    .catch(error => callback(error));
};

module.exports.cancel = cancel;
