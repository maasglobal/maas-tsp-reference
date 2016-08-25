'use strict';

const chai = require('chai');
const expect = chai.expect;
const wrap = require('lambda-wrapper').wrap;
const path = require('path');
const event = require(path.resolve('./bookings-citybikes/bookings-citybikes-options-list/event.json'));

module.exports = lambda => {
  describe('options-list functional tests', () => {
    describe('lambda function: query bikes for Helsinki', () => {
      let error;
      let response;

      before(done => {
        wrap(lambda).run(event, (err, data) => {
          error = err;
          response = data;
          done();
        });
      });

      it('should be successful', () => {
        expect(error).to.be.null;
        expect(response).to.not.be.empty;
      });
    });
  });
};
