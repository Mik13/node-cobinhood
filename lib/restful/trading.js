const send = require('./send')
const Decimal = require('decimal.js')

const formatOrder = (order) => ({
  id: order.id,
  tradingPair: order.trading_pair_id,
  side: order.side,
  type: order.type,
  size: new Decimal(order.size),
  price: new Decimal(order.price),
  filled: new Decimal(order.filled),
  state: order.state,
  timestamp: new Date(order.timestamp),
  eqPrice: new Decimal(order.eq_price),
  stopPrice: order.stop_price? new Decimal(order.stop_price): null,
  completedAt: order.completed_at? new Date(order.completed_at): null,
  source: order.source,
})

const listOrders = function() { return (
  this.send('listOrders')
  .then((result) => {
    result.orders = result.orders.map(formatOrder)
    return result
  })
) }

const placeLimitOrder = function(pair, side, price, size) { return (
  this.placeOrder(pair, 'limit', side, price, size)
) }

const placeMarketOrder = function(pair, side, size) { return (
  this.placeMarketOrder(pair, 'market', side, '0', size)
) }

const placeLimitStopOrder = function(pair, side, price, size, stopPrice) { return (
  this.placeOrder(pair, 'limit_stop', side, price, size, stopPrice)
) }

const placeMarketStopOrder = function(pair, side, size, stopPrice) { return (
  this.placeOrder(pair, 'market_stop', side, '0', size, stopPrice)
) }

const placeOrder = function(pair, type, side, price, size, stopPrice = '') { return (
  this.send('placeOrder', {
    trading_pair_id: pair,
    type: type,
    side: side,
    price: price.toString(),
    size: size.toString(),
    stop_price: price.toString(),
  })
  .then((result) => formatOrder(result.order))
) }

const cancelOrder = function(id) { return (
 this.send('cancelOrder', { id: id })
) }

const modifyOrder = function(id, pair, price, size) { return (
  this.send('modifyOrder', {
    id: id,
    trading_pair_id: pair,
    price: price.toString(),
    size: size.toString(),
  })
) }

const getOrder = function(id) { return (
  this.send('getOrder', { id: id })
  .then((result) => formatOrder(result.order))
) }

module.exports = {
  listOrders,
  placeLimitOrder,
  placeMarketOrder,
  placeLimitStopOrder,
  placeMarketStopOrder,
  placeOrder,
  cancelOrder,
  getOrder,
  modifyOrder,
}
