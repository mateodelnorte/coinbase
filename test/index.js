'use strict';

var log = require('debug')('coinbase:test'),
    util = require('util');

require('should');

var Coinbase = require('../lib/index');

if (!process.env.COINBASE_API_KEY) throw new Error('You must specify a COINBASE_API_KEY environment variable to run tests');

var coinbase = new Coinbase({
  APIKey: process.env.COINBASE_API_KEY
});

describe('coinbase.account.balance', function () {
  it('should return account balance', function (done) {
    coinbase.account.balance(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('amount');
      data.should.have.property('currency', 'BTC');
      done();
    });
  });
});
describe('coinbase.account.receiveAddress', function () {
  it('should return the user\'s current bitcoin receive address', function (done) {
    coinbase.account.receiveAddress(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('success', true);
      data.should.have.property('address');
      data.should.have.property('callback_url');
      done();
    });
  });
});
describe('coinbase.account.generateReceiveAddress', function () {
  it('should generate a new receive address', function (done) {
    coinbase.account.generateReceiveAddress(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('success', true);
      data.should.have.property('address');
      data.should.have.property('callback_url');
      done();
    });
  });
  it('should generate a new receive address with callback', function (done) {
    var url = 'https://www.example.com/callback';
    coinbase.account.generateReceiveAddress(url, function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('success', true);
      data.should.have.property('address');
      data.should.have.property('callback_url', url); // TODO: enforce callback value ***api is currently not passing this back. may be a bug in the api
      done();
    });
  });
});
describe('coinbase.button', function () {
  it('should generate a new button', function (done) {
    var param = {
                  "button": {
                    "name": 'test',
                    "price_string": '1.23',
                    "price_currency_iso": 'USD',
                    "custom": 'Order123',
                    "description": 'Sample description',
                    "type": 'buy_now',
                    "style": 'custom_large'
                  }
                };
    coinbase.buttons.create(param, function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('success', true);
      data.should.have.property('button');
      data.button.should.have.property('code');
      data.button.should.have.property('type');
      data.button.should.have.property('style');
      data.button.should.have.property('text');
      data.button.should.have.property('name');
      data.button.should.have.property('description');
      data.button.should.have.property('custom');
      data.button.should.have.property('price');
      done();
    });
  });
});
describe('coinbase.buy', function () {
  it('should buy one btc', function (done) {
    coinbase.buy({ name: 'test', qty: 1, price: { cents: 1, currency_iso: 'USD' } }, function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('success', true);
      data.should.have.property('transfer');
      data.transfer.should.have.property('fees');
      data.transfer.should.have.property('status');
      data.transfer.should.have.property('btc');
      data.btc.transfer.should.have.property('amount', 1);
      done();
    });
  });
});
describe('coinbase.contacts', function () {
  it('should return the user\'s previously emailed contacts', function (done) {
    coinbase.contacts(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('contacts');
      data.should.have.property('total_count');
      data.should.have.property('num_pages');
      data.should.have.property('current_page');
      done();
    });
  });
});
describe('coinbase.currencies.list', function () {
  it('should return list of supported currencies', function (done) {
    coinbase.currencies.list(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.length.should.be.above(0);
      done();
    });
  });
});
describe('coinbase.currencies.exchangeRates', function () {
  it('should return current currency exchange rates', function (done) {
    coinbase.currencies.exchangeRates(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('btc_to_usd');
      data.should.have.property('usd_to_btc');
      done();
    });
  });
});
describe('coinbase.orders.list', function () {
  it('should return list of supported orders', function (done) {
    coinbase.orders.list(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('orders');
      data.should.have.property('total_count');
      data.should.have.property('num_pages');
      data.should.have.property('current_page');
      done();
    });
  });
});
describe('coinbase.orders.get', function () {
  it('should return current currency exchange rates', function (done) {
    coinbase.orders.get(0, function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      done();
    });
  });
});
describe('coinbase.prices.buy', function () {
  it('should return the total buy price for some bitcoin amount', function (done) {
    coinbase.prices.buy(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('amount');
      data.should.have.property('currency');
      done();
    });
  });
});
describe('coinbase.prices.sell', function () {
  it('should return the total sell price for some bitcoin amount', function (done) {
    coinbase.prices.sell(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('amount');
      data.should.have.property('currency');
      done();
    });
  });
});
describe('coinbase.transactions.list', function () {
  it('should return the user\'s most recent transactions', function (done) {
    coinbase.transactions.list(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('current_user');
      data.should.have.property('balance');
      data.should.have.property('total_count');
      data.should.have.property('transactions');
      done();
    });
  });
});
describe('coinbase.transactions.get', function () {
  it('should return the details of an individual transaction', function (done) {
    coinbase.transactions.get(0, function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('transaction');
      data.transaction.should.have.property('id');
      data.transaction.should.have.property('amount');
      done();
    });
  });
});
describe('coinbase.transfers.list', function () {
  it('should return the user\'s most recent transfers', function (done) {
    coinbase.transfers.list(function (err, data) {
      if (err) throw err;
      log('data: ' + util.inspect(data));
      data.should.have.property('transfers');
      data.should.have.property('total_count');
      data.should.have.property('num_pages');
      data.should.have.property('current_page');
      done();
    });
  });
});