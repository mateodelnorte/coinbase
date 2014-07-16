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

describe('coinbase.account.balance', function () {
  it('should return account balance', function (done) {
    coinbase.account.balance(function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
      data.should.have.property('amount');
      data.should.have.property('currency', 'BTC');
      done();
    });
  });
});
describe('coinbase.account.receiveAddress', function () {
  it('should return the user\'s current bitcoin receive address', function (done) {
    coinbase.account.receiveAddress(function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
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
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
      data.should.have.property('success', true);
      data.should.have.property('address');
      data.should.have.property('callback_url');
      done();
    });
  });
  it('should generate a new receive address with callback', function (done) {
    var url = 'https://www.example.com/callback';
    coinbase.account.generateReceiveAddress(url, function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
      data.should.have.property('success', true);
      data.should.have.property('address');
      data.should.have.property('callback_url', url); // TODO: enforce callback value ***api is currently not passing this back. may be a bug in the api
      done();
    });
  });

  it('should generate a new receive address with a callback and label', function (done) {
    var url = 'https://www.example.com/callback';
    var label = 'test';
    coinbase.account.generateReceiveAddress(url, label, function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
      data.should.have.property('success', true);
      data.should.have.property('address');
      data.should.have.property('callback_url', url); // TODO: enforce callback value ***api is currently not passing this back. may be a bug in the api
      data.should.have.property('label', label);
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
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
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
describe('coinbase.contacts', function () {
  it('should return the user\'s previously emailed contacts', function (done) {
    coinbase.contacts(function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
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
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
      data.length.should.be.above(0);
      done();
    });
  });
});
describe('coinbase.currencies.exchangeRates', function () {
  it('should return current currency exchange rates', function (done) {
    coinbase.currencies.exchangeRates(function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
      data.should.have.property('btc_to_usd');
      data.should.have.property('usd_to_btc');
      done();
    });
  });
});
describe('coinbase.orders.list', function () {
  it('should return list of supported orders', function (done) {
    coinbase.orders.list(function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
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
    coinbase.orders.list(function (err, ordersList) {
      if (err) return done(err);
      if (ordersList.orders.length === 0) return done();
      coinbase.orders.get(ordersList.orders[0].order.id, function (err, data) {
        if (err) return done(err);
        log('data: ' + util.inspect(data, null, 5));
        done();
      });
    });
  });
});
describe('coinbase.prices.buy', function () {
  it('should return the total buy price for some bitcoin amount', function (done) {
    coinbase.prices.buy(function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
      data.should.have.property('amount');
      data.should.have.property('currency');
      done();
    });
  });
});
describe('coinbase.prices.sell', function () {
  it('should return the total sell price for some bitcoin amount', function (done) {
    coinbase.prices.sell(function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
      data.should.have.property('amount');
      data.should.have.property('currency');
      done();
    });
  });
});
describe('coinbase.transactions.list', function () {
  it('should return the user\'s most recent transactions', function (done) {
    coinbase.transactions.list(function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
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
    coinbase.transactions.list(function (err, txList) {
      if (err) return done(err);
      coinbase.transactions.get(txList.transactions[0].transaction.id, function (err, data) {
        if (err) return done(err);
        log('data: ' + util.inspect(data, null, 5));
        data.should.have.property('transaction');
        data.transaction.should.have.property('id');
        data.transaction.should.have.property('amount');
        done();
      });
    });
  });
});
describe('coinbase.transfers.list', function () {
  it('should return the user\'s most recent transfers', function (done) {
    coinbase.transfers.list(function (err, data) {
      if (err) return done(err);
      log('data: ' + util.inspect(data, null, 5));
      data.should.have.property('transfers');
      data.should.have.property('total_count');
      data.should.have.property('num_pages');
      data.should.have.property('current_page');
      done();
    });
  });
});


/*
 *
 *      WARNING!: THESE TESTS BUY/SELL REAL BTC.
 *                BY DEFAULT THESE ARE SKIPPED
 *
 */
describe.skip('WARNING', function() {
  describe('coinbase.buy', function () {
    it('should buy one btc', function (done) {
      coinbase.buy({ name: 'test', qty: 1, price: { cents: 1, currency_iso: 'USD' } }, function (err, data) {
        if (err) return done(err);
        log('data: ' + util.inspect(data, null, 5));
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

  describe('coinbase.transactions.send_money', function () {
    var to = 'REPLACE_ME@SOMEEMAIL.FOO';
    it('should send money and return the details of send_money transaction', function (done) {
      var amount = '0.0000001';
      coinbase.transactions.send_money({to: to, amount: amount, notes: 'btc4u'}, function (err, data) {
        if (err) return done(err);
        log('data: ' + util.inspect(data, null, 5));
        data.should.have.property('success', true);
        data.should.have.property('transaction');
        data.transaction.should.have.property('id');
        data.transaction.should.have.property('amount');
        data.transaction.should.have.property('status', 'complete');
        data.transaction.amount.should.have.property('amount');
        Math.abs(Number(data.transaction.amount.amount)).should.be.eql(Number(amount));
        done();
      });
    });

    it('should send invalid amount and return CoinbaseError', function (done) {
      var amount = '0.000000001'; // invalid amount
      coinbase.transactions.send_money({to: to, amount: amount, notes: 'btc4u'}, function (err, data) {
        err.should.have.property('error');
        err.error.should.be.instanceOf(Array).and.have.lengthOf(1);
        err.error[0].should.be.eql('You must enter a valid amount');
        done();
      });
    });
  });
  
  describe('coinbase.orders.create', function () {
    it('should generate a new order', function (done) {
      var param = {
                    "button": {
                      "name": 'test',
                      "type": 'buy_now',
                      "price_string": '1.23',
                      "price_currency_iso": 'USD',
                    }
                  };
      coinbase.orders.create(param, function (err, data) {
        if (err) return done(err);
        log('data: ' + util.inspect(data, null, 5));
        data.should.have.property('success', true);
        data.should.have.property('order');
        data.order.should.have.property('id');
        data.order.should.have.property('created_at');
        data.order.should.have.property('status');
        data.order.should.have.property('total_btc');
        data.order.should.have.property('total_native');
        data.order.should.have.property('receive_address');
        data.order.should.have.property('button');
        done();
      });
    });
  });
});
