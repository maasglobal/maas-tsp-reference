'use strict';

function validateRequest(event) {
  if (!event.tspId) {
    return Promise.reject(new Error('400: tspId is required'));
  }

  return Promise.resolve(true);
}

function handleResponse(callback) {
  const newData = {
    state: 'CANCELLED',
    meta: {
      string: 'Retain this string accross requests',
      object: {
        key: 'value',
      },
    },
  };

  callback(null, newData);
}

function handleError(error, callback) {
  console.warn('An error occurred', error.message);
  console.warn('Stack:', error.stack);

  callback(error);
}

module.exports.respond = function (event, cb) {
  validateRequest(event)
    .then(() => handleResponse(cb), error => handleError(error, cb));
}
