'use strict';

var log = require('debug')('coinbase'),
    request = require('request'),
    util = require('util');

function CoinbaseError (error) {
  Error.captureStackTrace(this, CoinbaseError);
  this.error = error;
}

util.inherits(CoinbaseError, Error);

CoinbaseError.prototype.toString = function toString () {
  return "CoinbaseError: " + this.error;
}

function Coinbase (options) {
  if (!options || !options.APIKey) throw new CoinbaseError('Must provide an APIKey in order to interact with the coinbase api');
  this.apiKey = (options && options.APIKey) ? options.APIKey : '';
  this.baseUrl = 'https://coinbase.com/api/v1/';

  var self = this;

  this.account = {};

  function get (url, callback) {
    request.get(url, function (err, res, data) {
      if (err) { 
        callback(err);
      } else {
        try {
          data = JSON.parse(data);
          if (data.success === false) {
            callback(new CoinbaseError(data.errors || data.error))
          } else {
            callback(null, data);
          }
        } catch (err) {
          callback(err);
        }
      }
    });
  }

  function post (url, param, callback) {
    request.post({
        headers: { 
          'content-type': 'application/json'
        },
        url: url,
        body: JSON.stringify(param)
      }, function (err, res, data) {
      if (err) { 
        callback(err);
      } else if (res.statusCode !== 200) {
        callback(new CoinbaseError(res.headers.status));
      } else{
        try {
          data = JSON.parse(data);
          if (data.success === false) {
            callback(new CoinbaseError(data.errors || data.error));
          } else {
            callback(null, data);
          }
        } catch (err) {
          if (data.errors) {
            callback(new CoinbaseError(data.errors));
          } else {
            callback(data);
          }
        }
      }
    });
  }

  /* GET /api/v1/account/balance */
  this.account.balance = function (callback) {
    var url = self.baseUrl + 'account/balance' + '?api_key=' + self.apiKey;
  
    log('get ' + url);
  
    get(url, callback);
  };

  /* GET /api/v1/account/receive_address */
  this.account.receiveAddress = function (callback) {
    var url = self.baseUrl + 'account/receive_address' + '?api_key=' + self.apiKey;
    
    log('get ' + url);
    
    get(url, callback);
  };

  /* GET /api/v1/account/generate_receive_address */
  this.account.generateReceiveAddress = function (callbackUrl, callback) {
    if (typeof callbackUrl === 'function') {
      callback = callbackUrl;
      callbackUrl = null;
    }
    
    var url = self.baseUrl + 'account/generate_receive_address' + '?api_key=' + self.apiKey;
    var options = { api_key: self.apiKey };
    
    if (callbackUrl) options.address = { callback_url: callbackUrl };
    
    log('post ' + url + ' with options ' + util.inspect(options));
    
    post(url, options, callback);
  };

  this.buttons = {};
  /* POST https://coinbase.com/api/v1/buttons */
  this.buttons.create = function (param, callback) {
    var url = self.baseUrl + 'buttons' + '?api_key=' + self.apiKey;
    
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

    var url = self.baseUrl + 'buttons' + '?api_key=' + self.apiKey;
    
    log('post ' + url);
    
    post(url, param, callback);
  };

  /* /api/v1/contacts */
  this.contacts = function (callback) {
    var url = self.baseUrl + 'contacts' + '?api_key=' + self.apiKey;
    
    log('get ' + url);
    
    get(url, callback);
  };

  this.currencies = {};

  /* GET /api/v1/currencies */
  this.currencies.list = function (callback) {
    var url = self.baseUrl + 'currencies' + '?api_key=' + self.apiKey;
    
    log('get ' + url);
    
    get(url, callback);
  };

  /* GET /api/v1/currencies/exchange_rates */
  this.currencies.exchangeRates = function (callback) {
    var url = self.baseUrl + 'currencies/exchange_rates' + '?api_key=' + self.apiKey;
    
    log('get ' + url);
    
    get(url, callback);
  };

  this.orders = {};

  /* GET /api/v1/orders */
  this.orders.list = function (callback) {
    var url = self.baseUrl + 'orders' + '?api_key=' + self.apiKey;
    
    log('get ' + url);
    
    get(url, callback);
  }

  /* GET /api/v1/orders/:id */
  this.orders.get = function (id, callback) {
    var url = self.baseUrl + 'orders/' + id + '?api_key=' + self.apiKey;
    
    log('get ' + url);
    
    get(url, callback);
  }

  this.prices = {};

  /* GET /api/v1/prices/buy */
  this.prices.buy = function (options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    
    var url = self.baseUrl + 'prices/buy' + '?api_key=' + self.apiKey;
    if (options.qty) url = url + '&qty=' + options.qty;
    if (options.currency) url = url + '&currency=' + options.currency;
    
    log('get ' + url);
    
    get(url, callback);
  };

  /* GET /api/v1/prices/sell */
  this.prices.sell = function (options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    
    var url = self.baseUrl + 'prices/sell' + '?api_key=' + self.apiKey;
    if (options.qty) url = url + '&qty=' + options.qty;
    if (options.currency) url = url + '&currency=' + options.currency;

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
    
    var url = self.baseUrl + 'transactions' + '?api_key=' + self.apiKey + '&page=' + page;
    
    log('get ' + url);
    
    get(url, callback);
  };

  /* GET /api/v1/transactions/:id */
  this.transactions.get = function (id, callback) {
    var url = self.baseUrl + 'transactions/' + id + '?api_key=' + self.apiKey;
    
    log('get ' + url);
    
    get(url, callback);
  };

  this.transfers = {};

  /* GET /api/v1/transfers */
  this.transfers.list = function (callback) {
    var url = self.baseUrl + 'transfers' + '?api_key=' + self.apiKey;
    
    log('get ' + url);
    
    get(url, callback);
  }

}

module.exports = Coinbase;