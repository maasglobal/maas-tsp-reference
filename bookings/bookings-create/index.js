'use strict';

module.exports.respond = function(event, cb) {
  // Copy the body, alter state, inject meta
  var body = event;
  var now = Date.now();
  var newData = {
    tspId: 'tsp-' + body.bookingId,
    state: 'RESERVED',
    token: {
      validityDuration: {
        from: now,
        to: now + 60*60*1000,
      }
    },
    terms: {
      todo: "example terms",
    },
    meta: {
      string: 'Retain this string accross requests',
      object: {
        key: 'value',
      }
    }
  };
  var response = Object.assign({}, body, newData);

  return cb(null, response);
};
