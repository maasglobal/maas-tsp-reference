'use strict';

/**
 *
 * Usage: Template check are done using regex
 *
 * Format: ${className}:${schemaId}
 * E.g: core:agency-option -> (core > agency-option)
 * E.g: maas-backend:autocomplete-query-request -> (maas-backend > autocomplete-query-request)
 */

/*eslint-disable quote-props*/
module.exports = {
  core: { // Core schemas
    'agency-option': './core/agency-option.json',
    'booking': './core/booking.json',
    'customer': './core/customer.json',
    'error': './core/error.json',
    'geolocation': './core/geolocation.json',
    'itinerary': './core/itinerary.json',
    'plan': './core/plan.json',
    'transport-service-provider': './core/transport-service-provider.json',
    'units': './core/units.json',
  },
  'tsp': { // Schemas for TSP adapter
    // Booking cancel
    'booking-cancel-request': './tsp/booking-cancel/request.json',
    'booking-cancel-response': './tsp/booking-cancel/response.json',

    // Booking create
    'booking-create-request': './tsp/booking-create/request.json',
    'booking-create-response': './tsp/booking-create/response.json',

    // Booking options list req / res
    'booking-options-list-request': './tsp/booking-options-list/request.json',
    'booking-options-list-response': './tsp/booking-options-list/response.json',

    // Booking read by id
    'booking-read-by-id-request': './tsp/booking-read-by-id/request.json',
    'booking-read-by-id-response': './tsp/booking-read-by-id/response.json',

    // Booking option schema
    'booking-option': './tsp/booking-option.json',

    // Booking schema for a TSP adapter
    'booking': './tsp/booking.json',

    // Request customer
    'request-customer': './tsp/request-customer.json',
  },
};
/*eslint-enable quote-props*/
