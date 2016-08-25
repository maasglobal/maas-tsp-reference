'use strict';

const path = require('path');
const chai = require('chai');
const moment = require('moment');
const wrap = require('lambda-wrapper').wrap;
const schemaUtils = require(path.resolve('./schemas/index.js'));
const expect = chai.expect;

const handlers = {
  'bookings-cancel': [
    {
      agencyId: 'citybikes',
      handler: require(path.resolve('./bookings-citybikes/bookings-citybikes-cancel/handler')),
      eventData: require(path.resolve('./bookings-citybikes/bookings-citybikes-cancel/event.json')),
    },
  ],
  'bookings-create': [
    {
      agencyId: 'citybikes',
      handler: require(path.resolve('./bookings-citybikes/bookings-citybikes-create/handler')),
      eventData: require(path.resolve('./bookings-citybikes/bookings-citybikes-create/event.json')),
    },
  ],
  'bookings-options-list': [
    {
      agencyId: 'citybikes',
      handler: require(path.resolve('./bookings-citybikes/bookings-citybikes-options-list/handler')),
      eventData: require(path.resolve('./bookings-citybikes/bookings-citybikes-options-list/event.json')),
    },
  ],
  'bookings-read-by-id': [
    {
      agencyId: 'citybikes',
      handler: require(path.resolve('./bookings-citybikes/bookings-citybikes-retrieve/handler')),
      eventData: require(path.resolve('./bookings-citybikes/bookings-citybikes-retrieve/event.json')),
    },
  ],
};

const wrapPromise = (handler, event) => {
  return new Promise((resolve, reject) => {
    wrap(handler).run(event, (responseError, response) => {
      if (responseError) return reject(responseError);
      return resolve(response);
    });
  });
};


describe('TSP adapter response validation', function () {
  this.timeout(60 * 1000);

  const generateTestCases = (schemaId, modules) => {
    const eventTimes = {
      startTime: moment().add(30, 'minutes').valueOf(),
      endTime: moment().add(1, 'days').valueOf(),
    };

    modules.forEach(moduleObject => {
      it(`${moduleObject.agencyId} handler should return a valid response`, _done => {
        const _event = Object.assign({}, moduleObject.eventData, eventTimes);
        return wrapPromise(moduleObject.handler, _event)
          .then(response => schemaUtils.validate(schemaId, response))
          .then(validationResult => {
            expect(validationResult).to.be.null;
            _done();
          })
          .catch(_done);
      });
    });
  };

  describe('cancel', () => {
    generateTestCases('tsp:booking-cancel-response', handlers['bookings-cancel']);
  });

  describe('create', () => {
    generateTestCases('tsp:booking-create-response', handlers['bookings-create']);
  });

  describe('options-list', () => {
    generateTestCases('tsp:booking-options-list-response', handlers['bookings-options-list']);
  });

  describe('read-by-id', () => {
    generateTestCases('tsp:booking-read-by-id-response', handlers['bookings-read-by-id']);
  });
});
