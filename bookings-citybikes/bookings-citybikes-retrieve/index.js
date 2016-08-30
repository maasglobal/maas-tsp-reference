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
 * Format a response that conforms to the TSP booking-retrieve response schema
 */
function formatResponse(event) {

  const booking = {
    tspId: event.tspId,
    state: 'RESERVED',
    leg: {
      mode: 'BICYCLE',
      from: {
        lat: 60.1724529,
        lon: 24.9386306,
      },
      to: {
        lat: 60.1724529,
        lon: 24.9386306,
      },
      startTime: 1474880046000,
      endTime: 1474880470000,
    },
    meta: {
      MODE_BICYCLE: {},
      identifier: 'fec75e528ae791012977771a95347a1e',
    },
    terms: {
      price: {
        amount: 1.50,
        currency: 'EUR',
      },
    },
    token: {
      type: 'CITYBIKES_PIN',
    },
    customer: {
      firstName: 'Jane',
      lastName: 'Maas',
      phone: '010 2345678',
      email: 'jane.maas@example.com',
    },
  };
  return Promise.resolve(booking);
}

/**
 * Booking retrieve responder
 * @param {object} event
 * @param {function} callback
 * @returns {Promise} A promise that lastly calls `callback` with the TSP response
 */
const retrieve = (event, callback) => {
  return validateEventData(event)
    .then(validatedEvent => formatResponse(validatedEvent))
    .then(result => callback(null, result))
    .catch(error => callback(error));
};

module.exports.retrieve = retrieve;
