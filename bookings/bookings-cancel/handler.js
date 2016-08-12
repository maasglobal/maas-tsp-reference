'use strict';

// Require Logic
const lib = require('./index');

// Lambda Handler
module.exports.handler = (event, context) => {
  lib.respond(event, (error, response) => context.done(error, response));
};
