import { connect } from 'react-redux'
import { compose } from 'redux'
import { push } from 'connected-react-router'
import Debug from 'debug'
import _size from 'lodash/size'

import { withTranslation } from 'react-i18next'
import OrderForm from './OrderForm'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import AOActions from '../../redux/actions/ao'
import { getAOParams } from '../../redux/selectors/ao'
import {
  getAuthToken,
  getCurrentModeAPIKeyState,
  getFilteredAtomicOrdersCount,
  getAtomicOrders,
  isSocketConnected,
  apiClientConnecting,
  apiClientConnected,
  getIsMainModeApiKeyUpdating,
  getIsPaperModeApiKeyUpdating,
} from '../../redux/selectors/ws'
import {
  getComponentState,
  getActiveMarket,
  getCurrentMode,
  getIsPaperTrading,
  getMaxOrderCounts,
  getIsBetaVersion,
  getIsStrategiesLiveExecVisible,
  getUIState,
} from '../../redux/selectors/ui'
import { getScope } from '../../util/scope'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import { LOG_LEVELS } from '../../constants/logging'

const debug = Debug('hfui:c:order-form')

const mapStateToProps = (state = {}, ownProps = {}) => {
  const { layoutID, layoutI: id } = ownProps
  const { ws = {} } = state
  const { favoriteTradingPairs = {} } = ws
  const { favoritePairs = [] } = favoriteTradingPairs
  const activeMarket = getActiveMarket(state)
  const isPaperTrading = getIsPaperTrading(state)
  const isKeysUpdating = isPaperTrading
    ? getIsPaperModeApiKeyUpdating(state)
    : getIsMainModeApiKeyUpdating(state)

  return {
    activeMarket,
    wsConnected: isSocketConnected(state),
    atomicOrdersCount: _size(getAtomicOrders(state)),
    atomicOrdersCountActiveMarket:
      getFilteredAtomicOrdersCount(state)(activeMarket),
    apiClientConnecting: apiClientConnecting(state),
    apiClientConnected: apiClientConnected(state),
    isKeysUpdating,
    savedState: getComponentState(state, layoutID, 'orderform', id),
    authToken: getAuthToken(state),
    apiCredentials: getCurrentModeAPIKeyState(state),
    favoritePairs,
    mode: getCurrentMode(state),
    isPaperTrading,
    isOrderExecuting: getUIState(state, UI_KEYS.isOrderExecuting, false),
    aoParams: getAOParams(state),
    maxOrderCounts: getMaxOrderCounts(state),
    isBetaVersion: getIsBetaVersion(state),
    showAdvancedAlgos:
      getIsStrategiesLiveExecVisible(state) || getIsBetaVersion(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  navigate: (route) => {
    dispatch(push(route))
  },

  setIsOrderExecuting: (executing) => {
    dispatch(UIActions.setUIValue(UI_KEYS.isOrderExecuting, executing))
  },

  submitOrder: ({ authToken, packet, wsConnected }) => {
    debug('submitting order %j', packet)
    const orderData = {
      symbol: packet.symbol.w,
      ...packet,
    }

    dispatch(
      WSActions.submitOrder(authToken, orderData),
    )
    dispatch(UIActions.logInformation('Initialising atomic order', LOG_LEVELS.INFO, 'atomic_order_init', orderData))

    if (!wsConnected) {
      dispatch(UIActions.setUIValue(UI_KEYS.isOrderExecuting, false))
    }
  },
  gaSubmitOrder: () => {
    dispatch(GAActions.submitAtomicOrder())
  },
  gaSubmitAO: () => {
    dispatch(GAActions.submitAO())
  },
  submitAlgoOrder: ({
    authToken, id, market, context, data, wsConnected,
  }) => {
    debug('submitting algo order %s on %s [%s]', id, market.uiID, context)
    const orderData = {
      ...data,
      _symbol: market.wsID,
      _margin: context === 'm',
      _futures: context === 'f',
    }
    dispatch(
      WSActions.submitAlgoOrder(authToken, id, orderData),
    )
    dispatch(UIActions.logInformation(`New ${id} algorithmic order submitted`, LOG_LEVELS.INFO, 'ao_init', orderData))

    if (!wsConnected) {
      dispatch(UIActions.setUIValue(UI_KEYS.isOrderExecuting, false))
    }
  },

  submitAPIKeys: ({ authToken, apiKey, apiSecret }, mode) => {
    dispatch(WSActions.updatingApiKey(mode, true))
    dispatch(
      WSActions.send([
        'api_credentials.save',
        authToken,
        apiKey,
        apiSecret,
        mode,
        mode,
        getScope(),
      ]),
    )
  },

  savePairs: (pairs, authToken, mode) => {
    dispatch(
      WSActions.send(['favourite_trading_pairs.save', authToken, pairs, mode]),
    )
  },

  getAlgoOrderParams: (aoID, symbol) => {
    dispatch(AOActions.getAlgoOrderParams(aoID, symbol))
  },

  resetActiveAOParamsID: () => {
    dispatch(AOActions.setActiveAOParamsID(null))
  },
})

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(OrderForm)
