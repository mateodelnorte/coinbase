'use strict';

var log = require('debug')('coinbase:test'),
    util = require('util');

require('should');

var Coinbase = require('../lib/index');

if (!process.env.COINBASE_API_KEY) throw new Error('You must specify a COINBASE_API_KEY environment variable to run tests');
if (!process.env.COINBASE_API_SECRET) throw new Error('You must specify a COINBASE_API_SECRET environment variable to run tests');

var coinbase = new Coinbase({
  APIKey: process.env.COINBASE_API_KEY,
  APISecret: process.env.COINBASE_API_SECRET
});

xdescribe('nonce', function () {
  it('should always increase, not overflow, and not return errors', function (done) {
    var i;
    for (i = 0; i < 1000; i++) { 
      coinbase.account.balance(function (err, data) {
        if (err) throw err;
        if (data.error) throw new Error(data.error);
      });
    };
  });
});