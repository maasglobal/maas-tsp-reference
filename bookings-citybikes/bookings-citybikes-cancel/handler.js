'use strict';

const citybikesTSP = require('./index');

module.exports.handler = function (event, context) {
  citybikesTSP.cancel(event, (error, response) => context.done(error, response));
};
