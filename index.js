const EventEmitter = require('events');
const API = require('./lib/restful')
const WS = require('./lib/ws')
const Decimal = require('decimal.js')

class Client extends EventEmitter {
  constructor(opts = {}) {
    super()
    this.key = opts.key
    this.api = new API(this)
    if (!opts.disableWS) {
      this.ws = new WS(this)
    }
    this.cache = {}
  }
  getTicker(pair) {
    return this.api.getTicker(pair)
  }
  getCandles(pair, start, end, timeframe) {
    return this.api.getCandles(pair, start, end, timeframe)
  }
  listOrders() {
    return this.api.listOrders()
  }
  listTradingPairs() {
    if (this.cache.tradingPairs) {
      return Promise.resolve(this.cache.tradingPairs)
    }
    return (
      this.api.listTradingPairs()
      .then((pairs) => this.cache.tradingPairs = pairs)
    )
  }
  placeLimitOrder(pair, side, price, size) {
    return this.api.placeLimitOrder(pair, side, price, size)
  }
  placeMarketOrder(pair, side, size) {
    return this.api.placeMarketOrder(pair, side, size)
  }
  placeLimitStopOrder(pair, side, price, size, stopPrice) {
    return this.api.placeLimitStopOrder(pair, side, price, size, stopPrice)
  }
  placeMarketStopOrder(pair, side, size, stopPrice) {
    return this.api.placeMarketStopOrder(pair, side, size, stopPrice)
  }
  cancelOrder(id) {
    return this.api.cancelOrder(id)
  }
  getOrder(id) {
    return this.api.getOrder(id)
  }
  modifyOrder(id, pair, price, size) {
    return this.api.modifyOrder(id, pair, price, size)
  }
  getBalance() {
    return this.api.getBalance()
  }
  getOrderbook(pair, precision) {
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.api.getOrderbook(pair, precision)
  }
  listTrades(pair) {
    return this.api.listTrades(pair)
  }
  subscribeOrder(fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribeOrder({}, fn)
  }
  unsubscribeOrder(fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribeOrder({}, fn)
  }
  subscribeTicker(pair, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribeTicker({
      trading_pair_id: pair
    }, fn)
  }
  unsubscribeTicker(pair, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribeTicker({
      trading_pair_id: pair
    }, fn)
  }
  subscribeTrade(pair, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribeTrade({
      trading_pair_id: pair
    }, fn)
  }
  unsubscribeTrade(pair, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribeTrade({
      trading_pair_id: pair
    }, fn)
  }
  subscribeOrderbook(pair, precision, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.ws.subscribeOrderbook({
      trading_pair_id: pair,
      precision: precision
    }, fn)
  }
  unsubscribeOrderbook(pair, precision, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.ws.unsubscribeOrderbook({
      trading_pair_id: pair,
      precision: precision
    }, fn)
  }
  subscribeCandle(pair, timeframe, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribeCandle({
      trading_pair_id: pair,
      timeframe: timeframe,
    }, fn)
  }
  unsubscribeCandle(pair, timeframe, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribeCandle({
      trading_pair_id: pair,
      timeframe: timeframe,
    }, fn)
  }
  close() {
    if (!this.ws) {
      return
    }
    this.ws.close()
  }
}

module.exports = Client
