'use strict';

const request = require('request-promise-lite');

module.exports.respond = function(event, cb) {

  const customer = event.customer || {};
  const leg = event.leg || {};
  request.post('https://api.dev.maas.global/tickets', { json: 1, body: {
    partnerId: 'HSL',
    partnerKey: 'secret!',
    startTime: leg.startTime,
    endTime: leg.endTime,
    ownerName: [customer.firstName, customer.lastName].filter(n => n).join(' '),
    meta: {
      customer: event.customer,
    }
  } } )
    .then( response => {
      const default_meta = {};
      default_meta[ 'MODE_' + leg.mode ] = {};
      var output = {
        tspId: response.ticketId,
        state: 'RESERVED',
        token: {
          type: "MAAS_TICKET",
          value: response.ticket,
        },
        leg: {
          mode: leg.mode,
          startTime: leg.startTime,
          endTime: leg.endTime,
        },
        terms: {
          price: {
            amount: 0,
            currency: 'EUR',
          },
        },
        meta: Object.assign( default_meta, event.meta || {} ),
      };

      return cb(null, output);
    } )
    .catch( error => {
      return cb( error );
    } );
};
