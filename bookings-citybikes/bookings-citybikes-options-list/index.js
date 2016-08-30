'use strict';

const citybikesAPI = require('../lib/citybikes-api');
const validateCoordinates = require('../lib/util').validateCoordinates;
const nearestLocation = require('../lib/util').nearestLocation;

/**
 * Validate the event data
 * @param {object} event - The event data from the event
 * @returns {Promise} A promise that resolves with the original event
 */
const validateEventData = event => (
  new Promise((resolve, reject) => {
    const parsed = {
      mode: event.mode,
      from: event.from,
      // API Gateway gives even undefined values as strings
      to: event.to !== '' ? event.to : null,
      startTime: event.startTime,
      endTime: event.endTime !== '' ? event.endTime : event.startTime,
    };

    if (parsed.mode !== 'BICYCLE') {
      return reject(new Error(`400: "mode" should be "BICYCLE", got ${event.mode}`));
    }

    if (!validateCoordinates(parsed.from)) {
      return reject(new Error(`400: "from" should be valid coordinates, got ${event.from}`));
    }

    return resolve(parsed);
  })
);

/**
 * Find the nearest bike network based
 * on given coordinates from a list of available
 * bike networks.
 * @param {object} networks
 * @param {number} location
 * @returns {Promise} A promise that resolves with a found newtork, rejects if no close matches are found
 */
const findNearestNetwork = (networks, location) => (
  new Promise((resolve, reject) => {
    const nearestNetwork = nearestLocation(location, networks.networks);
    return resolve(nearestNetwork.href);
  })
);

/**
 * Format a response that conforms to the TSP response schema
 */
function formatResponse(offers, parsedRequest) {
  const formattedStations = offers.map(station => {
    return {
      leg: {
        startTime: parsedRequest.startTime,
        endTime: parsedRequest.endTime,
        from: {
          lat: station.latitude,
          lon: station.longitude,
        },
        to: {
          lat: station.latitude,
          lon: station.longitude,
        },
        mode: 'BICYCLE',
        agencyId: 'Citybikes',
      },
      meta: {
        MODE_BICYCLE: {
        },
        citybikes: {
          identifier: station.id,
          station: {
            emptySlots: station.empty_slots,
            stationCode: station.extra.uid,
            freeBikes: station.free_bikes,
            location: {
              lat: station.latitude,
              lon: station.longitude,
            },
            name: station.name,
            modified: station.timestamp,
          },
        },
      },
      terms: {
        price: {
          amount: 1.50,
          currency: 'EUR',
        },
      },
    };
  });

  return {
    options: formattedStations,
  };
}

/**
 * Booking options list responder
 * @param {object} event
 * @param {function} callback
 * @returns {Promise} A promise that lastly calls `callback` with the TSP response
 */
const optionsList = (event, callback) => {
  return validateEventData(event)
    .then(event => citybikesAPI.networks())
    .then(results => findNearestNetwork(results, event.from))
    .then(closestNetwork => citybikesAPI.products(closestNetwork))
    .then(availableNetwork => formatResponse(availableNetwork.network.stations, event))
    .then(result => callback(null, result))
    .catch(error => callback(error));
};

module.exports.optionsList = optionsList;
