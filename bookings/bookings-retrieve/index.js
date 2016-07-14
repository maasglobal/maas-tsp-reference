'use strict';

module.exports.respond = function(event, cb) {
  console.log('event', JSON.stringify(event));

  // NOTE: This is completely mocked. Just token validity is updated.
  const now = new Date();
  const delta = {
    id: '' + event.id,
    state: 'PAID',
    token: {
      validityDuration: {
        from: now,
        to: now + 60*60*1000,
      }
    },
    meta: {
      string: 'Retain this string accross requests',
      object: {
        key: 'value',
      }
    }
  };
  return cb(null, delta);
};
