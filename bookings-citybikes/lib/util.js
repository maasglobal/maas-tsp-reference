'use strict';

const crypto = require('crypto');

/**
 * Validate coordinates
 * @param {object} coordinates - A location object see: "core/units.json#/definitions/location"
 * @returns {bool} True if the coordinates are valid, else false
 */
const validateCoordinates = coordinates => {
  return (coordinates &&
    coordinates.lat &&
    coordinates.lon &&
    Math.abs(coordinates.lat) <= 90 &&
    Math.abs(coordinates.lon) <= 180);
};

/**
 * Euclidean distance in 2 dimensions
 * @param {number} p1
 * @param {number} p2
 * @param {number} q1
 * @param {number} q2
 * @returns {number} The distance between the given points (q1, p1) and (q2, p2)
 */
const euclideanDistance = (p1, p2, q1, q2) => {
  return Math.sqrt(Math.pow(q1 - p1, 2) + Math.pow(q2 - p2, 2));
};


/**
 * Find the roughly closest location from a given array to a
 * reference point. Euclidean distance is used because accuracy
 * is not a factor.
 * NOTE: If more accurate results are needed use haversine instead.
 * @param {object} a location object containing lat and lon
 * @param {array} a list of locations. Actual coordinates are stored inside item.location.latitude
 */
const nearestLocation = (reference, locations) => {
  const threshold = 0.3; // Rough estimation of city sized areas ~15-30km
  let nearest = locations.reduce((prev, curr) => (
    // NOTE: This is a comparison between calculated distances and finding the shortest one
    euclideanDistance(
      reference.lat,
      reference.lon,
      prev.location.latitude,
      prev.location.longitude
    )
    // Comparison operator
    <
    euclideanDistance(
      reference.lat,
      reference.lon,
      curr.location.latitude,
      curr.location.longitude
    ) ? prev : curr
  ));

  //Check if closest found network is inside boundaries
  if (! (euclideanDistance(reference.lat, reference.lon, nearest.location.latitude, nearest.location.longitude) < threshold)) {
    nearest = {};
  }
  return nearest;
};

/**
 * Generate a random string that can be used as a simple ID
 */
const randomString = length => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports.validateCoordinates = validateCoordinates;
module.exports.nearestLocation = nearestLocation;
module.exports.randomString = randomString;
