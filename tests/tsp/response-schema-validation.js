'use strict';

const path = require('path');
const chai = require('chai');
const moment = require('moment');
const wrap = require('lambda-wrapper').wrap;
const schemaUtils = require(path.resolve('./schemas/index.js'));
const expect = chai.expect;

const handlers = {
  'booking-cancel': [
    {
      agencyId: 'citybikes',
      handler: require(path.resolve('./booking-citybikes/booking-citybikes-cancel/handler')),
      eventData: require(path.resolve('./booking-citybikes/booking-citybikes-cancel/event.json')),
    },
  ],
  'booking-create': [
    {
      agencyId: 'citybikes',
      handler: require(path.resolve('./booking-citybikes/booking-citybikes-create/handler')),
      eventData: require(path.resolve('./booking-citybikes/booking-citybikes-create/event.json')),
    },
  ],
  'booking-options-list': [
    {
      agencyId: 'citybikes',
      handler: require(path.resolve('./booking-citybikes/booking-citybikes-options-list/handler')),
      eventData: require(path.resolve('./booking-citybikes/booking-citybikes-options-list/event.json')),
    },
  ],
  'booking-read-by-id': [
    {
      agencyId: 'citybikes',
      handler: require(path.resolve('./booking-citybikes/booking-citybikes-retrieve/handler')),
      eventData: require(path.resolve('./booking-citybikes/booking-citybikes-retrieve/event.json')),
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
    generateTestCases('tsp:booking-cancel-response', handlers['booking-cancel']);
  });

  describe('create', () => {
    generateTestCases('tsp:booking-create-response', handlers['booking-create']);
  });

  describe('options-list', () => {
    generateTestCases('tsp:booking-options-list-response', handlers['booking-options-list']);
  });

  describe('read-by-id', () => {
    generateTestCases('tsp:booking-read-by-id-response', handlers['booking-read-by-id']);
  });
});
