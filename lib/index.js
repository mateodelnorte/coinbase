'use strict';
var log = require('debug')('coinbase'),
  microtime = require('microtime'),
  request = require('request'),
  util = require('util'),
  cryptoJS = require('crypto-js');

function CoinbaseError (error) {
  Error.captureStackTrace(this, CoinbaseError);
  this.error = error;
}

util.inherits(CoinbaseError, Error);

CoinbaseError.prototype.toString = function toString () {
  return "CoinbaseError: " + this.error;
}

var counter = 0, last = '';
function getNonce() {
  counter++;
  var nonce = microtime.now() + '' + (100 + counter % 100);
  if (nonce < last) {
    nonce = getNonce();
    last = nonce;
  }
  return nonce;
}

function Coinbase (options) {
  if (!options || !options.APIKey || !options.APISecret)
    throw new CoinbaseError('Must provide an APIKey and APISecret in order to interact with the coinbase api');
  this.apiKey = options.APIKey;
  this.apiSecret = options.APISecret;
  this.baseUrl = 'https://coinbase.com/api/v1/';

  var self = this;

  this.account = {};

  function get (url, callback) {
    var nonce = getNonce();
    var message = nonce + url;
    var signature = cryptoJS.HmacSHA256(message, self.apiSecret);
    var reqObject = {
      url: url,
      headers: {
        'ACCESS_KEY': self.apiKey,
        'ACCESS_SIGNATURE': signature,
        'ACCESS_NONCE': nonce
      }
    }

    request.get(reqObject, function (err, res, data) {
      if (err) {
        return callback(err);
      } else {
        try {
          data = JSON.parse(data);
        } catch (err) {
          return callback(err);
        }
        if (data.success === false || data.errors || data.error) {
          return callback(new CoinbaseError(data.errors || data.error))
        }
        return callback(null, data);
      }

    });
  }

  function post (url, param, callback) {
    var nonce = getNonce();
    var body = JSON.stringify(param);
    var message = nonce + url + body;
    var signature = cryptoJS.HmacSHA256(message, self.apiSecret);
    var reqObject = {
      headers: {
        'ACCESS_KEY': self.apiKey,
        'ACCESS_SIGNATURE': signature,
        'ACCESS_NONCE': nonce,
        'content-type': 'application/json'
      },
      url: url,
      body: body
    };

    request.post(reqObject, function (err, res, data) {
      if (err) { return callback(err); }
      try {
        data = JSON.parse(data);
      } catch (err) {
        return callback(err);
      }
      if (data.success === false || data.errors || data.error) {
        return callback(new CoinbaseError(data.errors || data.error))
      }
      return callback(null, data);
    });
  }

  /* GET /api/v1/account/balance */
  this.account.balance = function (callback) {
    var url = self.baseUrl + 'account/balance';

    log('get ' + url);

    get(url, callback);
  };

  /* GET /api/v1/account/receive_address */
  this.account.receiveAddress = function (callback) {
    var url = self.baseUrl + 'account/receive_address';

    log('get ' + url);

    get(url, callback);
  };

  /* GET /api/v1/account/generate_receive_address */
  this.account.generateReceiveAddress = function (callbackUrl, label, callback) {
    if (!callback) {
      if (!label) {
        if (typeof callbackUrl === 'function') {
          callback = callbackUrl;
          callbackUrl = null;
        } else {
          throw new CoinbaseError("couldn't resolve callback function")
        }
      } else if (typeof label === 'function') {
        callback = label;
        label = null;
      } else {
        throw new CoinbaseError("couldn't resolve callback function");
      }
    }

    var url = self.baseUrl + 'account/generate_receive_address';
    var options = { api_key: self.apiKey };

    if (callbackUrl) options.address = { 'callback_url': callbackUrl, 'label': label };

    log('post ' + url + ' with options ' + util.inspect(options));

    post(url, options, callback);
  };

  this.buttons = {};
  /* POST https://coinbase.com/api/v1/buttons */
  this.buttons.create = function (param, callback) {
    var url = self.baseUrl + 'buttons';

    log('post ' + url);

    post(url, param, function (err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
  };

  /* POST https://coinbase.com/api/v1/buys */
  this.buy = function (param, callback) {

    var url = self.baseUrl + 'buttons';

    log('post ' + url);

    post(url, param, callback);
  };

  /* /api/v1/contacts */
  this.contacts = function (callback) {
    var url = self.baseUrl + 'contacts';

    log('get ' + url);

    get(url, callback);
  };

  this.currencies = {};

  /* GET /api/v1/currencies */
  this.currencies.list = function (callback) {
    var url = self.baseUrl + 'currencies';

    log('get ' + url);

    get(url, callback);
  };

  /* GET /api/v1/currencies/exchange_rates */
  this.currencies.exchangeRates = function (callback) {
    var url = self.baseUrl + 'currencies/exchange_rates';

    log('get ' + url);

    get(url, callback);
  };

  this.orders = {};

  /* GET /api/v1/orders */
  this.orders.list = function (callback) {
    var url = self.baseUrl + 'orders';

    log('get ' + url);

    get(url, callback);
  }

  /* GET /api/v1/orders/:id */
  this.orders.get = function (id, callback) {
    var url = self.baseUrl + 'orders/' + id;

    log('get ' + url);

    get(url, callback);
  }

  /* POST /api/v1/orders */
  this.orders.create = function (options, callback) {
    var url = self.baseUrl + 'orders';

    log('post ' + url + ' with options ' + util.inspect(options));

    post(url, options, callback);
  }

  this.prices = {};

  /* GET /api/v1/prices/buy */
  this.prices.buy = function (options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    var url = self.baseUrl + 'prices/buy';
    var delim = '?';
    if (options.qty) {
      url = url + '?qty=' + options.qty;
      delim = '&';
    }
    if (options.currency) url = url + delim + 'currency=' + options.currency;

    log('get ' + url);

    get(url, callback);
  };

  /* GET /api/v1/prices/sell */
  this.prices.sell = function (options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    var url = self.baseUrl + 'prices/sell';
    var delim = '?';
    if (options.qty) {
      url = url + '?qty=' + options.qty;
      delim = '&';
    }
    if (options.currency) url = url + delim + 'currency=' + options.currency;

    log('get ' + url);

    get(url, callback);
  };

  this.transactions = {};
  /* GET /api/v1/transactions */
  this.transactions.list = function (page, callback) {
    if (typeof page === 'function') {
      callback = page;
      page = 1;
    }

    var url = self.baseUrl + 'transactions' + '?page=' + page;

    log('get ' + url);

    get(url, callback);
  };

  /* GET /api/v1/transactions/:id */
  this.transactions.get = function (id, callback) {
    var url = self.baseUrl + 'transactions/' + id;

    log('get ' + url);

    get(url, callback);
  };

  /* POST /api/v1/transactions/send_money */
  this.transactions.send_money = function(options, callback) {
    var url = self.baseUrl + 'transactions/send_money';

    log('post ' + url + ' with options ' + util.inspect(options));

    post(url, options, callback);
  };

  this.transfers = {};

  /* GET /api/v1/transfers */
  this.transfers.list = function (callback) {
    var url = self.baseUrl + 'transfers';

    log('get ' + url);

    get(url, callback);
  }

}

module.exports = Coinbase;
