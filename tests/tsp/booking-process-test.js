'use strict';

const path = require('path');
const chai = require('chai');
const moment = require('moment');
const wrap = require('lambda-wrapper').wrap;
const schemaUtils = require(path.resolve('./schemas/index.js'));
const expect = chai.expect;

const responseSchemas = {
  'booking-options-list': path.resolve('./schemas/tsp/booking-options-list/response.json'),
  'booking-create': path.resolve('./schemas/tsp/booking-create/response.json'),
  'booking-cancel': path.resolve('./schemas/tsp/booking-cancel/response.json'),
  'booking-read-by-id': path.resolve('./schemas/tsp/booking-read-by-id/response.json'),
};

const tsps = [];
/*const tsps = [
  {
    agencyId: 'citybikes',
    handlers: {
      'bookings-options-list': {
        handler: require(path.resolve('./bookings-citybikes/bookings-citybikes-options-retrieve/handler')),
        eventData: require(path.resolve('./bookings-citybikes/bookings-citybikes-options-retrieve/event.json')),
      },
      'bookings-create': {
        handler: require(path.resolve('./bookings-citybikes/bookings-citybikes-create/handler')),
        eventData: require(path.resolve('./bookings-citybikes/bookings-citybikes-create/event.json')),
      },
      'bookings-read-by-id': {
        handler: require(path.resolve('./bookings-citybikes/bookings-citybikes-retrieve/handler')),
        eventData: require(path.resolve('./bookings-citybikes/bookings-citybikes-retrieve/event.json')),
      },
      'bookings-cancel': {
        handler: require(path.resolve('./bookings-citybikes/bookings-citybikes-cancel/handler')),
        eventData: require(path.resolve('./booking-citybikes/booking-citybikes-cancel/event.json')),
      },
    },
  },
];*/

const wrapPromise = (handler, event) => {
  return new Promise((resolve, reject) => {
    wrap(handler).run(event, (responseError, response) => {
      if (responseError) return reject(responseError);
      return resolve(response);
    });
  });
};


describe('TSP booking worklow validation', function () {
  this.timeout(60 * 1000);

  const generateTestCases = tspSpec => {
    const eventTimes = {
      startTime: moment({ hours: 13 }).day(9).valueOf(),
      endTime: moment({ hours: 13 }).day(10).valueOf(),
    };
    const events = {};

    Object.keys(tspSpec.handlers).forEach(handlerKey => {
      const eventBase = tspSpec.handlers[handlerKey].eventData;
      let _event = Object.assign({}, eventBase);

      if (_event.hasOwnProperty('startTime')) {
        _event = Object.assign({}, _event, eventTimes);
      }

      if (_event.hasOwnProperty('leg') && _event.leg.hasOwnProperty('startTime')) {
        _event = Object.assign({}, _event, { leg: Object.assign({}, _event.leg, eventTimes) });
      }

      events[handlerKey] = _event;
    });

    it(`should be able to complete the booking workflow for ${tspSpec.agencyId}`, done => {
      let _previousResponse;
      let currentStep = 'bookings-options-list';
      let _event = events['bookings-options-list'];
      return wrapPromise(tspSpec.handlers[currentStep].handler, _event)
          .then(response => {
            _previousResponse = response;
            expect(_previousResponse.options).to.be.an('array').that.is.not.empty;
            return schemaUtils.validate(responseSchemas[currentStep], response);
          })
          .then(validationResult => {
            expect(validationResult).to.be.null;
            currentStep = 'bookings-create';
          })
          .then(() => {
            _event = Object.assign({}, events[currentStep], { meta: _previousResponse.options[0].meta });
            return wrapPromise(tspSpec.handlers[currentStep].handler, _event);
          })
          .then(response => {
            _previousResponse = response;
            return schemaUtils.validate(responseSchemas[currentStep], response);
          })
          .then(validationResult => {
            expect(validationResult).to.be.null;
            currentStep = 'bookings-read-by-id';
          })
          .then(() => {
            _event = Object.assign({}, events[currentStep], { tspId: _previousResponse.tspId });
            return wrapPromise(tspSpec.handlers[currentStep].handler, _event);
          })
          .then(response => {
            _previousResponse = response;
            return schemaUtils.validate(responseSchemas[currentStep], response);
          })
          .then(validationResult => {
            expect(validationResult).to.be.null;
            currentStep = 'bookings-cancel';
          })
          .then(() => {
            _event = Object.assign({}, events[currentStep], { tspId: _previousResponse.tspId });
            return wrapPromise(tspSpec.handlers[currentStep].handler, _event);
          })
          .then(response => {
            _previousResponse = response;
            return schemaUtils.validate(responseSchemas[currentStep], response);
          })
          .then(validationResult => {
            expect(validationResult).to.be.null;
            done();
          })
          .catch(error => {
            done(new Error([`@${currentStep}`, error.message].join(', ')));
          });
    });
  };

  tsps.forEach(tsp => generateTestCases(tsp));
});
