Coinbase
=====

Coinbase is a wrapper around the Coinbase.com bitcoin wallet and exchange API.

***Note that the Coinbase api is undergoing development. Methods here may break and documentation at https://coinbase.com/api/doc does not always appear to match the api's current status. As time goes on, things will solidify. For functionality that is not yet implemented, and where you might be able to help out, see the TODO list at bottom of this page. 
How to use it: 

Require coinbase

```
var Coinbase = require('coinbase');
var coinbase = new Coinbase({
  APIKey: process.env.COINBASE_API_KEY
});
```

Make a call to the API using a chosen method. 

```
coinbase.account.balance(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('amount');
  data.should.have.property('currency', 'BTC');
  done();
});
```

The following methods have been implemented and work against the Coinbase api. 

# TOC
   - [coinbase.account.balance](#coinbaseaccountbalance)
   - [coinbase.account.receiveAddress](#coinbaseaccountreceiveaddress)
   - [coinbase.account.generateReceiveAddress](#coinbaseaccountgeneratereceiveaddress)
   - [coinbase.button](#coinbasebutton)
   - [coinbase.buy](#coinbasebuy)
   - [coinbase.contacts](#coinbasecontacts)
   - [coinbase.currencies.list](#coinbasecurrencieslist)
   - [coinbase.currencies.exchangeRates](#coinbasecurrenciesexchangerates)
   - [coinbase.orders.list](#coinbaseorderslist)
   - [coinbase.orders.get](#coinbaseordersget)
   - [coinbase.prices.buy](#coinbasepricesbuy)
   - [coinbase.prices.sell](#coinbasepricessell)
   - [coinbase.transactions.list](#coinbasetransactionslist)
   - [coinbase.transactions.get](#coinbasetransactionsget)
   - [coinbase.transfers.list](#coinbasetransferslist)
<a name=""></a>
 
<a name="coinbaseaccountbalance"></a>
# coinbase.account.balance
should return account balance.

```js
coinbase.account.balance(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('amount');
  data.should.have.property('currency', 'BTC');
  done();
});
```

<a name="coinbaseaccountreceiveaddress"></a>
# coinbase.account.receiveAddress
should return the user's current bitcoin receive address.

```js
coinbase.account.receiveAddress(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('success', true);
  data.should.have.property('address');
  data.should.have.property('callback_url');
  done();
});
```

<a name="coinbaseaccountgeneratereceiveaddress"></a>
# coinbase.account.generateReceiveAddress
should generate a new receive address.

```js
coinbase.account.generateReceiveAddress(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('success', true);
  data.should.have.property('address');
  data.should.have.property('callback_url');
  done();
});
```

should generate a new receive address with callback.

```js
coinbase.account.generateReceiveAddress('https://www.example.com/callback', function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('success', true);
  data.should.have.property('address');
  data.should.have.property('callback_url'); // TODO: enforce callback value ***api is currently not passing this back. may be a bug in the api
  done();
});
```

<a name="coinbasebutton"></a>
# coinbase.button
should generate a new button.

```js
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
```

<a name="coinbasebuy"></a>
# coinbase.buy
<a name="coinbasecontacts"></a>
# coinbase.contacts
should return the user's previously emailed contacts.

```js
coinbase.contacts(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('contacts');
  data.should.have.property('total_count');
  data.should.have.property('num_pages');
  data.should.have.property('current_page');
  done();
});
```

<a name="coinbasecurrencieslist"></a>
# coinbase.currencies.list
should return list of supported currencies.

```js
coinbase.currencies.list(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.length.should.be.above(0);
  done();
});
```

<a name="coinbasecurrenciesexchangerates"></a>
# coinbase.currencies.exchangeRates
should return current currency exchange rates.

```js
coinbase.currencies.exchangeRates(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('btc_to_usd');
  data.should.have.property('usd_to_btc');
  done();
});
```

<a name="coinbaseorderslist"></a>
# coinbase.orders.list
should return list of supported orders.

```js
coinbase.orders.list(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('orders');
  data.should.have.property('total_count');
  data.should.have.property('num_pages');
  data.should.have.property('current_page');
  done();
});
```

<a name="coinbaseordersget"></a>
# coinbase.orders.get
<a name="coinbasepricesbuy"></a>
# coinbase.prices.buy
should return the total buy price for some bitcoin amount.

```js
coinbase.prices.buy(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('amount');
  data.should.have.property('currency');
  done();
});
```

<a name="coinbasepricessell"></a>
# coinbase.prices.sell
should return the total sell price for some bitcoin amount.

```js
coinbase.prices.sell(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('amount');
  data.should.have.property('currency');
  done();
});
```

<a name="coinbasetransactionslist"></a>
# coinbase.transactions.list
should return the user's most recent transactions.

```js
coinbase.transactions.list(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('current_user');
  data.should.have.property('balance');
  data.should.have.property('total_count');
  data.should.have.property('transactions');
  done();
});
```

<a name="coinbasetransactionsget"></a>
# coinbase.transactions.get
<a name="coinbasetransferslist"></a>
# coinbase.transfers.list
should return the user's most recent transfers.

```js
coinbase.transfers.list(function (err, data) {
  if (err) throw err;
  log('data: ' + util.inspect(data));
  data.should.have.property('transfers');
  data.should.have.property('total_count');
  data.should.have.property('num_pages');
  data.should.have.property('current_page');
  done();
});
```

TODO: 

The api currently only supports access via the API Key method. Oauth is next. 

The following methods are implemented, but not yet tested: 

- GET /api/v1/orders/:id
- GET /api/v1/transactions/:id

The following methods are implemented, but don't seem to match the actual api (parameters or constraints cause failure):

- POST /api/v1/buys *

The following methods are not yet implemented: 

- POST /api/v1/sells
- POST /api/v1/transactions/send_money
- POST /api/v1/transactions/request_money
- PUT /api/v1/transactions/:id/resend_request
- DELETE /api/v1/transactions/:id/cancel_request
- PUT /api/v1/transactions/:id/complete_request
- POST /api/v1/users
- PUT /api/v1/users/:id

\* The following error is returned from the cb api when calling /buys: 

  1) coinbase #buys should buy one btc:

```
  CoinbaseError: Price can't be blank
      at Request._callback (/Users/matt/development/coinbase/lib/index.js:67:22)
      at Request.self.callback (/Users/matt/development/coinbase/node_modules/request/index.js:142:22)
      at Request.EventEmitter.emit (events.js:98:17)
      at Request.<anonymous> (/Users/matt/development/coinbase/node_modules/request/index.js:856:14)
      at Request.EventEmitter.emit (events.js:117:20)
      at IncomingMessage.<anonymous> (/Users/matt/development/coinbase/node_modules/request/index.js:808:12)
      at IncomingMessage.EventEmitter.emit (events.js:117:20)
      at _stream_readable.js:895:16
      at process._tickCallback (node.js:415:13)
```