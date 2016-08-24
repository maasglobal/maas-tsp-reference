'use strict';

/**
 *  Citybikes v2 implementation to be used within
 *  MaasGlobal Citybikes-TSP -specific Lambdas
 *  API documentation: http://api.citybik.es/v2/
 */

// Module dependencies
const request = require('request-promise-lite');

// Configuration
//const CITYBIKES_ENDPOINT_URL = process.env.CITYBIKES_ENDPOINT_URL;
const CITYBIKES_ENDPOINT_URL = 'http://api.citybik.es';

/**
 * List Citybikes networks
 * @returns {Promise} A promise that resolves w/ a list of all
 * Citybikes networks (bike networks) and their coordinates.
 * This is used for later finding a network/station nearby
 * the user.
 */
const networks = () => {
  return request
    .get(`${CITYBIKES_ENDPOINT_URL}/v2/networks`, {
      json: true,
    })
    .then(response => response)
    .catch(error => {
      return Promise.reject(error);
    });
};

/**
 * List Citybikes products from a selected network
 * @param {float} network
 * @returns {Promise} A promise that resolves w/ a list of currently
 *          available citybikes for the given network
 */
const products = network => {
  return request
    .get(CITYBIKES_ENDPOINT_URL + network, {
      json: true,
    })
    .then(response => response)
    .catch(error => {
      return Promise.reject(error);
    });
};

/**
 * MOCK: Create a reservation. Basically this returns a PIN
 * to unlock a bike based on the given phone number of a user.
 * Data is fetched from a predefined JSON formatted object.
 */
const create = phonenumber => {
  const mockedDB = require('./test-user-codes.json');
  const foundUser = mockedDB.customers.filter(obj => (
    obj.phone === phonenumber
  ));
  return Promise.resolve(foundUser.length > 0 ? foundUser[0] : {});
};

module.exports.networks = networks;
module.exports.products = products;
module.exports.create = create;
