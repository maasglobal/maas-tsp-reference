'use strict';

const citybikesAPI = require('../lib/citybikes-api');
const validateCoordinates = require('../lib/util').validateCoordinates;
const randomId = require('../lib/util').randomString;

/**
 * Validate the event data
 * @param {object} event - The event data from the event
 * @returns {Promise} A promise that resolves with the original event
 */
const validateEventData = event => (
  new Promise((resolve, reject) => {
    const parsed = {
      leg: event.leg,
      meta: event.meta,
      // API Gateway gives even undefined values as strings
      customer: event.customer,
    };
    if (parsed.leg.mode !== 'BICYCLE') {
      return reject(new Error(`400: "mode" should be "BICYCLE", got ${parsed.leg.mode}`));
    }

    if (!validateCoordinates(parsed.leg.from)) {
      return reject(new Error(`400: "from" should be valid coordinates, got ${parsed.leg.from}`));
    }

    return resolve(parsed);
  })
);

/**
 * Format a response that conforms to the TSP booking-create response schema
 */
function formatResponse(reservation, parsedRequest) {
  return Promise.resolve({
    terms: {
      price: {
        amount: 1.50,
        currency: 'EUR',
      },
    },
    token: {
      type: 'CITYBIKES_PIN',
      value: reservation.PIN,
    },
    meta: {
      MODE_BICYCLE: {
      },
      success: true,
      id: reservation.id,
      security_code: reservation.PIN,
      reservation: reservation,
    },
    customer: parsedRequest.customer,
    leg: Object.assign( {}, parsedRequest.leg, { mode: 'BICYCLE' } ),
    tspId: randomId(16),
  });
}

/**
 * Booking create responder
 * @param {object} event
 * @param {function} callback
 * @returns {Promise} A promise that lastly calls `callback` with the TSP response
 */
const create = (event, callback) => {
  return validateEventData(event)
    .then(event => citybikesAPI.create(event.customer.phone))
    .then(userAndPIN => formatResponse(userAndPIN, event))
    .then(result => callback(null, result))
    .catch(error => callback(error));
};

module.exports.create = create;
