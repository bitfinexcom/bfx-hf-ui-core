import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import _isNumber from 'lodash/isNumber'
import _isEmpty from 'lodash/isEmpty'
import _reduce from 'lodash/reduce'
import _map from 'lodash/map'
import Debug from 'debug'
import { v4 } from 'uuid'
import i18nLib from '../../../locales/i18n'

import UIActions from '../../actions/ui'
import WSActions from '../../actions/ws'
import AOActions from '../../actions/ao'
import zendeskActions from '../../actions/zendesk'
import marketActions from '../../actions/market'
import closeElectronApp from '../../helpers/close_electron_app'
import { MAIN_MODE, PAPER_MODE } from '../../reducers/ui'
import tokenStore from '../../../util/token_store'
import { AOAdapter } from '../../adapters/ws'
import { isElectronApp, HONEY_AUTH_URL } from '../../config'

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
  const hasDataUpdates = _isNumber(payload[0]) && _isArray(payload[1])

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
        const [, , markets] = payload
        store.dispatch(WSActions.recvDataMarkets(markets))
        store.dispatch(marketActions.getCCYFullNames())
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
        store.dispatch(WSActions.send(['strategy.execute_status', token]))
        break
      }

      case 'auth.user_id': {
        const [, userId, { mode } = {}] = payload
        store.dispatch(WSActions.recvUserId(userId))

        const isPaperTrading = mode === PAPER_MODE
        store.dispatch(UIActions.setTradingMode(mode === PAPER_MODE))
        store.dispatch(UIActions.setMarketFromStore(isPaperTrading))
        break
      }

      case 'auth.token': {
        const [, tokenObj] = payload
        tokenStore.set(tokenObj?.authToken)
        break
      }

      case 'auth.failure': {
        // if the authorisation token on hosted app is not valid, redirect to a page where it will be updated
        if (!isElectronApp) {
          window.location.replace(HONEY_AUTH_URL) // eslint-disable-line lodash/prefer-lodash-method
        }

        break
      }

      case 'data': {
        const [, , chanID, exData] = payload
        store.dispatch(WSActions.bufferDataFromExchange(chanID, exData))
        break
      }

      case 'data.sync.start': {
        const [, , symbol, tf, start, end] = payload
        store.dispatch(WSActions.recvDataSyncStart({
          symbol, tf, start, end,
        }))
        break
      }

      case 'data.sync.end': {
        const [, , symbol, tf, start, end] = payload
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
      case 'data.favourite_trading_pairs.saved': {
        const [, pairs] = payload
        store.dispatch(WSActions.recvUpdatedFavoritePairs(pairs))
        break
      }

      case 'data.algo_order_params': {
        const [, algoID, symbol, algoOrderParams] = payload
        store.dispatch(AOActions.setAlgoOrderParams(algoID, symbol, algoOrderParams))
        break
      }

      case 'data.algo_order_params.saved': {
        const [, id, algoOrderParams] = payload
        const { algoID, symbol } = algoOrderParams
        store.dispatch(AOActions.getAlgoOrderParams(algoID, symbol))
        store.dispatch(AOActions.setActiveAOParamsID(id))
        break
      }

      case 'data.algo_order.submit_status':
      case 'data.order.submit_status':
        store.dispatch(UIActions.setIsOrderExecuting(false))
        break

      case 'error': {
        const [, message, i18n] = payload
        let text = message
        if (i18n) {
          const isNotificationMessage = i18nLib.exists(`notifications.${i18n.key}`)
          if (isNotificationMessage) {
            text = i18nLib.t(`notifications.${i18n.key}`, i18n.props)
          } else {
            const isAlgoOrderValidMessage = i18nLib.exists(`algoOrderForm.validationMessages.${i18n.key}`)
            if (isAlgoOrderValidMessage) {
              i18nLib.t(`algoOrderForm.validationMessages.${i18n.key}`, i18n.props)
            }
          }
        }
        store.dispatch(WSActions.recvNotification({
          status: 'error',
          text,
          mts: Date.now(),
          cid: v4(),
        }))
        break
      }

      case 'notify': {
        const [, status, message, i18n] = payload

        const notificationObject = {
          status,
          text: i18n ? i18nLib.t(`notifications.${i18n.key}`, i18n.props) : message,
          mts: Date.now(),
          cid: v4(),
          i18n,
        }
        store.dispatch(WSActions.recvNotification(notificationObject))
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

      case 'data.settings.updated': {
        const [, settings] = payload
        store.dispatch(WSActions.recvUpdatedSettings(settings))
        break
      }

      /* settings format
        [{
            key: 'te_limit_order_*',
            value: [
              ['te_limit_order_cnt', '3000'],
              ['te_limit_order_symbol_cnt', '300'],
            ],
          }]
      */
      case 'data.core_settings': {
        const [, settings] = payload
        const transformed = _reduce(settings, (acc, { key, value }) => {
          let innerObj = value
          if (_isArray(value)) {
            innerObj = _reduce(value, (acc2, [key2, value2]) => {
              return {
                ...acc2,
                [key2]: value2,
              }
            }, {})
          }

          return {
            ...acc,
            [key]: innerObj,
          }
        }, {})

        store.dispatch(WSActions.recvCoreSettings(transformed))
        break
      }

      case 'data.client': {
        const [, , status] = payload
        store.dispatch(WSActions.recvClientStatusUpdate({ status }))
        break
      }

      case 'data.positions': {
        const [, , positions] = payload
        store.dispatch(WSActions.recvPositions({ positions }))
        break
      }

      case 'data.position': {
        const [, , position] = payload
        store.dispatch(WSActions.recvPosition({ position }))
        break
      }

      case 'data.position.close': {
        const [, , position] = payload
        store.dispatch(WSActions.recvPositionClose({ position }))
        break
      }

      case 'data.balances': {
        const [, , balances] = payload
        store.dispatch(WSActions.recvBalances({ balances }))
        break
      }

      case 'data.balance': {
        const [, , balance] = payload
        store.dispatch(WSActions.recvBalance({ balance }))
        break
      }

      case 'data.orders': {
        const [, , orders] = payload
        store.dispatch(WSActions.recvOrders({ orders }))
        break
      }

      case 'data.order': {
        const [, , order] = payload
        store.dispatch(WSActions.recvOrder({ order }))
        break
      }

      case 'data.order.close': {
        const [, , order] = payload
        store.dispatch(WSActions.recvOrderClose({ order }))
        break
      }

      case 'data.aos': {
        const [, , aos] = payload
        const adapted = _map(aos, ao => (_isArray(ao) ? AOAdapter(ao) : ao))
        store.dispatch(WSActions.recvDataAlgoOrders({ aos: adapted }))
        break
      }

      case 'data.ao': {
        const [, , ao] = payload
        store.dispatch(WSActions.recvDataAlgoOrder({ ao }))
        break
      }

      case 'data.ao.stopped': {
        const [, , gid] = payload
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
        const [, , , from, to] = payload
        store.dispatch(WSActions.recvBacktestStart({ from, to }))
        break
      }

      case 'bt.candle': {
        const [, , , candle] = payload
        store.dispatch(WSActions.recvBacktestCandle(candle))
        break
      }

      case 'bt.trade': {
        const [, , , trade] = payload
        store.dispatch(WSActions.recvBacktestTrade(trade))
        break
      }

      case 'bt.end': {
        const [, , , from, to] = payload
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

      case 'strategy.start_live_execution_submit_status': {
        const [, status] = payload

        if (status) {
          store.dispatch(WSActions.startLiveExecution())
        } else {
          store.dispatch(WSActions.stopLiveExecution())
        }
        store.dispatch(WSActions.setExecutionLoading(false))

        break
      }

      case 'strategy.stop_live_execution_submit_status': {
        const [, status] = payload

        if (status) {
          store.dispatch(WSActions.stopLiveExecution())
        } else {
          store.dispatch(WSActions.startLiveExecution())
        }
        store.dispatch(WSActions.setExecutionLoading(false))

        break
      }

      case 'strategy.live_execution_status': {
        const [, status, options] = payload

        if (status) {
          store.dispatch(WSActions.startLiveExecution())
        } else {
          store.dispatch(WSActions.stopLiveExecution())
        }

        if (!_isEmpty(options)) {
          store.dispatch(WSActions.setExecutionOptions(options))
        }

        store.dispatch(WSActions.setExecutionLoading(false))

        break
      }

      case 'strategy.live_execution_results': {
        const [, results] = payload
        store.dispatch(WSActions.setExecutionResults(results))

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
