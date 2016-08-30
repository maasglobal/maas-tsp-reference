'use strict';

const citybikesTSP = require('./index');

module.exports.handler = function (event, context) {
  citybikesTSP.create(event, (error, response) => context.done(error, response));
};

