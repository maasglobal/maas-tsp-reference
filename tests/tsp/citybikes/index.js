'use strict';

const path = require('path');
const optionsListFunctionalTests = require(path.resolve('./tests/tsp/citybikes/options-list-functional-tests'));
const bookingCreateFunctionalTests = require(path.resolve('./tests/tsp/citybikes/booking-create-functional-tests'));

const optionsListLambda = require(path.resolve('./bookings-citybikes/bookings-citybikes-options-list/handler'));
const bookingCreateLambda = require(path.resolve('./bookings-citybikes/bookings-citybikes-create/handler'));

// describe('Citybikes API functional tests', () => {
//   citybikesAPIFunctionalTests();
// });

describe('options-list', () => {
  //optionsListUnitTests();
  optionsListFunctionalTests(optionsListLambda);
  bookingCreateFunctionalTests(bookingCreateLambda);
});
