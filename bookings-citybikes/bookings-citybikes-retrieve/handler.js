'use strict';

const citybikesTSP = require('./index');

module.exports.handler = function (event, context) {
  citybikesTSP.retrieve(event, (error, response) => context.done(error, response));
};
