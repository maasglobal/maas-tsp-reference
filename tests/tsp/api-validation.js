'use strict';

//const path = require('path');
const chai = require('chai');
//const moment = require('moment');
const expect = chai.expect;
const request = require('request-promise-lite');

// Local development server (API - Gateway emulator)
const API_HOST = 'http://localhost:3000';
const API_RESOURCE = '/citybikes/bookings';
const requestOptions = {
  json: true,
  resolveWithFullResponse: true,
};

describe('TSP API validation:', function () {
  this.timeout(60 * 1000);

  describe('method cancel', () => {
    it('should return 200 OK when making a valid request', () => {
      return request.del(`${API_HOST}${API_RESOURCE}/1234`, requestOptions)
        .then(resp => {
          expect(resp.statusCode).to.equal(200);
          expect(resp.body).to.have.property('state');
        }).catch(err => {
          expect(err).to.be.null;
        });
    });

    it('should return an error when making an invalid request', () => {
      return request.del(`${API_HOST}${API_RESOURCE}`, requestOptions)
        .then(resp => {
          expect(resp.body).to.be.null;
        }).catch(err => {
          expect(err).to.exist;
          expect(err.statusCode).to.equal(404);
        });
    });
  });

  describe('method create', () => {
    it('should return 200 OK when making a valid request', () => {
      const query = {
        leg: {
          mode: 'BICYCLE',
          from: {
            lat: 60.1724529,
            lon: 24.9386306,
          },
          to: {
            lat: 60.1724529,
            lon: 24.9386306,
          },
          startTime: 1474880046000,
          endTime: 1474880470000,
        },
        meta: {
          MODE_BICYCLE: {
          },
          identifier: 'fec75e528ae791012977771a95347a1e',
        },
        customer: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '010 2345678',
          email: 'jane.maas@example.com',
        },
      };
      const reqOpt = Object.assign({}, requestOptions);
      reqOpt.body = query;
      return request.post(`${API_HOST}${API_RESOURCE}`, reqOpt)
        .then(resp => {
          expect(resp.statusCode).to.equal(200);
        }).catch(err => {
          expect(err, err.response.body.errorMessage).to.be.null;
        });
    });

    it('should return an Error and 400 status when making an invalid request', () => {
      const query = {
        mode: 'UNKNOWN_MODE',
      };
      const reqOpt = Object.assign({}, requestOptions);
      reqOpt.body = query;
      return request.post(`${API_HOST}${API_RESOURCE}`, reqOpt)
        .then(resp => {
          expect(resp).to.be.null;
        }).catch(err => {
          expect(err, err.response.body.errorMessage).not.to.be.null;
          expect(err.response.statusCode).to.equal(400);
        });
    });
  });

  describe('method options-list', () => {
    it('should return 200 OK when making a valid request', () => {
      const query = {
        mode: 'BICYCLE',
        fromLat: 60.3210549,
        fromLon: 24.9506771,
        startTime: 1472731200000,
        endTime: 1472731200000,
      };
      const reqOpt = Object.assign({}, requestOptions);
      reqOpt.qs = query;
      return request.get(`${API_HOST}${API_RESOURCE}/options`, reqOpt)
        .then(resp => {
          expect(resp.statusCode).to.equal(200);
        }).catch(err => {
          expect(err, err.response.body.errorMessage).to.be.null;
        });
    });

    it('should return an Error and 400 status when making an invalid request', () => {
      const query = {
        mode: 'UNKNOWN_MODE',
        fromLat: 60.3210549,
        fromLon: 24.9506771,
        startTime: 1472731200000,
        endTime: 1472731200000,
      };
      const reqOpt = Object.assign({}, requestOptions);
      reqOpt.qs = query;
      return request.get(`${API_HOST}${API_RESOURCE}/options`, reqOpt)
        .then(resp => {
          expect(resp).to.be.null;
        }).catch(err => {
          expect(err, err.response.body.errorMessage).not.to.be.null;
          expect(err.response.statusCode).to.equal(400);
        });
    });
  });

  describe('method read-by-id', () => {
    it('should return 200 OK when making a valid request', () => {
      return request.get(`${API_HOST}${API_RESOURCE}/1234`, requestOptions)
        .then(resp => {
          expect(resp.statusCode).to.equal(200);
        }).catch(err => {
          expect(err).to.be.null;
        });
    });

    it('should return an error when making an invalid request', () => {
      return request.get(`${API_HOST}${API_RESOURCE}`, requestOptions)
        .then(resp => {
          expect(resp.body).to.be.null;
        }).catch(err => {
          expect(err).to.exist;
          expect(err.statusCode).to.equal(404);
        });
    });
  });
});
