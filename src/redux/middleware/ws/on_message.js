import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import _isNumber from 'lodash/isNumber'
import Debug from 'debug'
import { v4 } from 'uuid'

import UIActions from '../../actions/ui'
import WSActions from '../../actions/ws'
import AOActions from '../../actions/ao'
import zendeskActions from '../../actions/zendesk'
import marketActions from '../../actions/market'
import closeElectronApp from '../../helpers/close_electron_app'
import { MAIN_MODE, PAPER_MODE } from '../../reducers/ui'

const debug = Debug('hfui:rx:m:ws-hfui-server:msg')

export default (alias, store) => (e = {}) => {
  const { data = '' } = e
  let payload

  try {
    payload = JSON.parse(data)
  } catch (error) {
    console.error('[wss] error parsing JSON: ', error.message)
    return
  }

  if (!_isObject(payload)) {
    console.error('[wss] recv invalid ws payload: ', payload)
    return
  }
  const event = payload?.event
  const hasDataUpdates = _isNumber(payload[0]) && _isArray(payload[1])

  if (event === 'subscribed') {
    const { chanId: chanID, channel: chanName, symbol } = payload
    store.dispatch(WSActions.pubSubscribed({ chanID, chanName, symbol }))
  }

  if (hasDataUpdates) {
    const [chanID, exData] = payload
    store.dispatch(WSActions.bufferDataFromExchange(chanID, null, exData))
  }

  if (_isArray(payload)) {
    const [type] = payload
    switch (type) {
      case 'info.version': {
        debug('API version %s', payload[1])
        break
      }

      case 'info.markets': {
        const [,, markets] = payload
        store.dispatch(WSActions.recvDataMarkets(markets))
        store.dispatch(marketActions.getCCYFullNames())
        store.dispatch(marketActions.getPerpsNames())
        store.dispatch(zendeskActions.getCcyIds())
        break
      }

      case 'info.auth_configured': {
        const [, configured] = payload
        store.dispatch(WSActions.recvAuthConfigured(configured))
        break
      }

      case 'info.auth_token': {
        const [, token] = payload
        store.dispatch(WSActions.recvAuthToken(token))
        store.dispatch(AOActions.getActiveAlgoOrders())
        break
      }

      case 'auth.user_id': {
        const [, userId] = payload
        store.dispatch(WSActions.recvUserId(userId))
        break
      }

      case 'data': {
        const [,, chanID, exData] = payload
        store.dispatch(WSActions.bufferDataFromExchange(chanID, exData))
        break
      }

      case 'data.sync.start': {
        const [,, symbol, tf, start, end] = payload
        store.dispatch(WSActions.recvDataSyncStart({
          symbol, tf, start, end,
        }))
        break
      }

      case 'data.sync.end': {
        const [,, symbol, tf, start, end] = payload
        store.dispatch(WSActions.recvDataSyncEnd({
          symbol, tf, start, end,
        }))
        break
      }

      case 'data.strategies': {
        const [, strategies] = payload
        store.dispatch(WSActions.recvStrategies({ strategies }))
        break
      }

      case 'data.strategy': {
        const [, id, strategy] = payload
        store.dispatch(WSActions.recvStrategy({ id, strategy }))
        break
      }

      case 'data.strategy.removed': {
        const [, id] = payload
        store.dispatch(WSActions.recvRemovedStrategy(id))
        break
      }
      case 'data.favourite_trading_pairs':
      case 'data.favourite_trading_pairs.saved': {
        const [, pairs] = payload
        store.dispatch(WSActions.recvUpdatedFavoritePairs(pairs))
        break
      }

      case 'data.algo_order.submit_status':
      case 'data.order.submit_status':
        store.dispatch(UIActions.setIsOrderExecuting(false))
        break

      case 'error': {
        const [, message] = payload
        store.dispatch(WSActions.recvNotification({
          status: 'error',
          text: message,
          mts: Date.now(),
          cid: v4(),
        }))
        break
      }

      case 'notify': {
        const [, status, message] = payload
        store.dispatch(WSActions.recvNotification({
          status,
          text: message,
          mts: Date.now(),
          cid: v4(),
        }))
        break
      }

      case 'data.show_algo_pause_info': {
        const [, visible] = payload

        if (visible) {
          store.dispatch(UIActions.changeAOPauseModalState(visible))
        } else {
          closeElectronApp()
        }

        break
      }

      case 'data.api_credentials.validation': {
        const [, apiKeysState] = payload
        store.dispatch(WSActions.recvAPICredentialsConfigured(apiKeysState))
        // delay for showing 'validation...' message
        setTimeout(() => {
          store.dispatch(WSActions.updatingApiKey(MAIN_MODE, false))
          store.dispatch(WSActions.updatingApiKey(PAPER_MODE, false))
        }, 1000)

        break
      }

      case 'data.settings':
      case 'data.settings.saved': {
        const [, settings] = payload
        store.dispatch(WSActions.recvUpdatedSettings(settings))
        break
      }

      case 'data.client': {
        const [,, status] = payload
        store.dispatch(WSActions.recvClientStatusUpdate({ status }))
        break
      }

      case 'data.positions': {
        const [,, positions] = payload
        store.dispatch(WSActions.recvPositions({ positions }))
        break
      }

      case 'data.position': {
        const [,, position] = payload
        store.dispatch(WSActions.recvPosition({ position }))
        break
      }

      case 'data.position.close': {
        const [,, position] = payload
        store.dispatch(WSActions.recvPositionClose({ position }))
        break
      }

      case 'data.balances': {
        const [,, balances] = payload
        store.dispatch(WSActions.recvBalances({ balances }))
        break
      }

      case 'data.balance': {
        const [,, balance] = payload
        store.dispatch(WSActions.recvBalance({ balance }))
        break
      }

      case 'data.orders': {
        const [,, orders] = payload
        store.dispatch(WSActions.recvOrders({ orders }))
        break
      }

      case 'data.order': {
        const [,, order] = payload
        store.dispatch(WSActions.recvOrder({ order }))
        break
      }

      case 'data.order.close': {
        const [,, order] = payload
        store.dispatch(WSActions.recvOrderClose({ order }))
        break
      }

      case 'data.aos': {
        const [,, aos] = payload
        store.dispatch(WSActions.recvDataAlgoOrders({ aos }))
        break
      }

      case 'data.ao': {
        const [,, ao] = payload
        store.dispatch(WSActions.recvDataAlgoOrder({ ao }))
        break
      }

      case 'data.ao.stopped': {
        const [,, gid] = payload
        store.dispatch(WSActions.recvDataAlgoOrderStopped({ gid }))
        break
      }

      case 'bt.exec': {
        const [, from, to, symbol, tf, withCandles, withTrades, syncData] = payload
        store.dispatch(WSActions.recvBacktestExecute({
          from,
          to,
          symbol,
          tf,
          withCandles,
          withTrades,
          syncData,
        }))
        break
      }

      case 'bt.start': {
        const [,,, from, to] = payload
        store.dispatch(WSActions.recvBacktestStart({ from, to }))
        break
      }

      case 'bt.candle': {
        const [,,, candle] = payload
        store.dispatch(WSActions.recvBacktestCandle(candle))
        break
      }

      case 'bt.trade': {
        const [,,, trade] = payload
        store.dispatch(WSActions.recvBacktestTrade(trade))
        break
      }

      case 'bt.end': {
        const [,,, from, to] = payload
        store.dispatch(WSActions.recvBacktestEnd({ from, to }))
        break
      }

      case 'bt.btresult': {
        const [, res] = payload
        store.dispatch(WSActions.recvBacktestResults(res))
        break
      }

      case 'algo.active_orders': {
        const [, activeAlgoOrders] = payload
        store.dispatch(AOActions.setActiveAlgoOrders(activeAlgoOrders))
        store.dispatch(AOActions.showActiveOrdersModal(true))
        break
      }

      case 'algo.reload': {
        store.dispatch(WSActions.clearAlgoOrders())
        store.dispatch(AOActions.getActiveAlgoOrders())
        break
      }

      case 'refresh': {
        window.location.reload()
        break
      }

      default: {
        break
      }
    }
  }
}
