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
import { isElectronApp, HONEY_AUTH_URL } from '../../config'
import { AOAdapter } from '../../adapters/ws'
import { UI_MODAL_KEYS } from '../../constants/modals'
import { UI_KEYS } from '../../constants/ui_keys'
import { WS_CONNECTION } from '../../constants/ws'
import { getCurrentStrategy } from '../../selectors/ui'

const debug = Debug('hfui:rx:m:ws-hfui-server:msg')

export default (alias, store) => (e = {}) => {
  const { data = '' } = e
  const state = store.getState()

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

        // reset order history
        store.dispatch(WSActions.resetOrderHist())
        store.dispatch(WSActions.recvAuthToken(token))
        store.dispatch(WSActions.send(['strategy.execute_status', token]))
        break
      }

      case 'info.auid': {
        const [, auid, { mode }] = payload

        store.dispatch(WSActions.recvUserAuid(auid, mode))
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
        store.dispatch(UIActions.setUIValue(UI_KEYS.isOrderExecuting, false))
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
          store.dispatch(UIActions.changeUIModalState(
            UI_MODAL_KEYS.AO_PAUSE_MODAL,
            visible,
          ))
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

      case 'data.api_credentials.reset': {
        const [, mode, status] = payload

        if (!status) {
          return
        }

        store.dispatch(WSActions.recvAPICredentialsReset(mode))
        break
      }

      case 'data.settings.updated': {
        const [, settings] = payload
        store.dispatch(UIActions.setUIValue(UI_KEYS.settings, settings))
        break
      }

      case 'data.feature_flags': {
        const [, featureFlags] = payload
        store.dispatch(UIActions.setUIValue(UI_KEYS.featureFlags, featureFlags))
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

        store.dispatch(UIActions.setUIValue(UI_KEYS.coreSettings, transformed))
        break
      }

      case 'data.client': {
        const [, , mode, status] = payload
        store.dispatch(WSActions.recvClientStatusUpdate({ status, mode }))

        if (status === WS_CONNECTION.CLOSED) {
          store.dispatch(UIActions.setUIValue(UI_KEYS.isBadInternetConnection, true))
        }

        if (status === WS_CONNECTION.OPENED) {
          store.dispatch(UIActions.setUIValue(UI_KEYS.isBadInternetConnection, false))
        }

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

      case 'data.order_history': {
        const [, orderHist] = payload
        store.dispatch(UIActions.setUIValue(UI_KEYS.isLoadingOrderHistData, false))
        store.dispatch(WSActions.recvOrderHist({ orderHist }))
        break
      }

      case 'data.aos': {
        const [, , , aos] = payload

        if (_isEmpty(aos)) {
          break
        }

        const adapted = _map(aos, ao => (_isArray(ao) ? AOAdapter(ao) : ao))
        store.dispatch(AOActions.setActiveAlgoOrders(adapted))
        store.dispatch(AOActions.showActiveOrdersModal(true))
        break
      }

      case 'data.ao': {
        const [, , mode, ao] = payload
        store.dispatch(WSActions.recvDataAlgoOrder({ mode, ao }))
        break
      }

      case 'data.ao.stopped': {
        const [, , mode, gid] = payload
        store.dispatch(WSActions.recvDataAlgoOrderStopped({ mode, gid }))
        break
      }

      case 'algo.order_history_loaded': {
        const [, aos] = payload
        store.dispatch(WSActions.recvDataAlgoOrdersHistory(aos))
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

      case 'bt.progress': {
        const [, progressPerc] = payload
        store.dispatch(WSActions.recvBacktestProgress(progressPerc))
        break
      }

      case 'bt.btresult': {
        const [, res] = payload
        store.dispatch(WSActions.recvBacktestResults(res))
        break
      }

      case 'bt.started': {
        const [, gid] = payload
        store.dispatch(WSActions.recvBacktestStarted(gid))
        break
      }

      case 'bt.stopped': {
        const [, gid] = payload
        store.dispatch(WSActions.recvBacktestStopped(gid))
        break
      }

      case 'algo.reload': {
        store.dispatch(WSActions.clearAlgoOrders())
        store.dispatch(AOActions.getActiveAlgoOrders())
        break
      }

      case 'strategy.live_execution_status': {
        store.dispatch(WSActions.setExecutionLoading(false))

        break
      }

      // emitted when the strategy execution is started
      case 'strategy.live_execution_started': {
        const [, strategyMapKey, executionResultsObj] = payload
        const { startedOn } = executionResultsObj
        store.dispatch(WSActions.setStartedLiveStrategy(strategyMapKey, executionResultsObj))

        const currentStrategy = getCurrentStrategy(state)
        store.dispatch(UIActions.setCurrentStrategy({ ...currentStrategy, startedOn, executionId: strategyMapKey }, MAIN_MODE))

        break
      }

      case 'strategy.start_live_execution_submit_status': {
        const [, status, gid] = payload

        if (status) {
          store.dispatch(WSActions.setExecutionLoadingGid(gid))
        } else {
          store.dispatch(WSActions.setExecutionLoading(false, gid))
        }

        break
      }

      // emitted when the strategy execution is stopped
      case 'strategy.live_execution_stopped': {
        const [, strategyMapKey, executionResultsObj] = payload
        store.dispatch(WSActions.setStoppedLiveStrategy(strategyMapKey, executionResultsObj))

        const currentStrategy = getCurrentStrategy(state)
        store.dispatch(UIActions.setCurrentStrategy(
          { ...currentStrategy, stoppedOn: new Date().getTime() },
          MAIN_MODE,
        ))

        break
      }

      // emitted on each price update
      case 'strategy.rt_execution_results': {
        const [, strategyMapKey, executionResultsObj] = payload
        store.dispatch(WSActions.setLivePriceUpdate(strategyMapKey, executionResultsObj))

        break
      }

      // emitted when a position is opened
      case 'strategy.opened_position_data': {
        const [, strategyMapKey, openedPositionDetails] = payload

        store.dispatch(WSActions.setLiveExecutionTrades(strategyMapKey, openedPositionDetails, true))

        break
      }

      // emitted when a position is closed
      case 'strategy.closed_position_data': {
        const [, strategyMapKey, closedPositionDetails] = payload

        store.dispatch(WSActions.setLiveExecutionTrades(strategyMapKey, closedPositionDetails, false))

        break
      }

      case 'data.past_strategies': {
        const [, pastStrategies] = payload
        store.dispatch(WSActions.setPastStrategies(pastStrategies))

        break
      }

      case 'strategy.live_execution_results': {
        const [, strategyId, results] = payload
        store.dispatch(WSActions.setExecutionResults(strategyId, results))

        break
      }

      case 'strategy.connection_lost': {
        const [, isConnectionLost] = payload
        store.dispatch(WSActions.setExecutionConnectionStatus(isConnectionLost))

        break
      }

      case 'refresh': {
        window.location.reload()
        break
      }

      case 'info.services.status': {
        const [, mode, serviceStatus] = payload
        store.dispatch(UIActions.updateServiceStatus(mode, serviceStatus))
        break
      }

      case 'info.username': {
        const [,, username] = payload
        store.dispatch(WSActions.setUsername(username))
        break
      }

      case 'app.can_be_closed': {
        const [, canBeClosed] = payload
        if (canBeClosed) {
          closeElectronApp()
        } else {
          store.dispatch(UIActions.recvNotification({
            mts: Date.now(),
            status: 'error',
            text: i18nLib.t('closeSessionModal.error'),
            cid: v4(),
          }))
        }
        break
      }

      default: {
        break
      }
    }
  }
}
