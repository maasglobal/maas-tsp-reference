'use strict';

function validateRequest(event) {
  if (!event.tspId) {
    return Promise.reject(new Error('400: tspId is required'));
  }

  return Promise.resolve(true);
}

function verifyResponse(response) {
  if (response.Error !== null) {
    return Promise.reject(new Error('400: Bad Request: ' + JSON.stringify(response.Error, null, 2)));
  }

  return Promise.resolve(response.Result);
}

function format(status) {
  if ( ! status.Cancellation.Ok ) {
    return Promise.reject(new Error('500: Cancellation was not Ok even though there were no errors'));
  }

  const result = {
    state: 'CANCELLED',
  };
  if ( status.Cancellation.Fee ) {
    result.meta = {
      cancellationFee: {
        amount: status.Cancellation.Fee.DueAmount,
        currency: status.Cancellation.Fee.Currency,
      },
    };
  }
  return result;
}

module.exports.respond = function (event, cb) {
  const newData = {
    state: 'CANCELLED',
    meta: {
      string: 'Retain this string accross requests',
      object: {
        key: 'value',
      }
    }
  };

  cb(null, newData);
};
