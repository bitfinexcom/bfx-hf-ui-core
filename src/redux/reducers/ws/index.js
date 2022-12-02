import { combineReducers } from 'redux'

import auth from './auth'
import socket from './socket'
import strategies from './strategies'
import apiClient from './api_client'
import positions from './positions'
import balances from './balances'
import orders from './orders'
import orderHistory from './order_history'
import algoOrders from './algo_orders'
import algoOrdersHistory from './algo_orders_history'
import backtest from './backtest'
import execution from './execution'
import favoriteTradingPairs from './favorite_pairs'

export default combineReducers({
  algoOrders,
  algoOrdersHistory,
  positions,
  balances,
  orders,
  orderHistory,
  apiClient,
  strategies,
  socket,
  auth,
  backtest,
  execution,
  favoriteTradingPairs,
})
