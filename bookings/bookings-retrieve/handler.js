'use strict';

module.exports.handler = function(event, context, cb) {
  console.log('event', JSON.stringify(event));

  // Have a tiny change (updated state);
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
