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
  getAPIClientState, getAuthToken, getCurrentModeAPIKeyState, getFilteredAtomicOrdersCount, getAtomicOrders,
} from '../../redux/selectors/ws'
import {
  getComponentState, getActiveMarket, getCurrentMode, getIsPaperTrading, getIsOrderExecuting, getMaxOrderCounts,
} from '../../redux/selectors/ui'
import { getScope } from '../../util/scope'

const debug = Debug('hfui:c:order-form')

const mapStateToProps = (state = {}, ownProps = {}) => {
  const { layoutID, layoutI: id } = ownProps
  const { ws = {} } = state
  const { favoriteTradingPairs = {} } = ws
  const { favoritePairs = [] } = favoriteTradingPairs
  const activeMarket = getActiveMarket(state)
  return {
    activeMarket,
    atomicOrdersCount: _size(getAtomicOrders(state)),
    atomicOrdersCountActiveMarket: getFilteredAtomicOrdersCount(state)(activeMarket),
    apiClientState: getAPIClientState(state),
    savedState: getComponentState(state, layoutID, 'orderform', id),
    authToken: getAuthToken(state),
    apiCredentials: getCurrentModeAPIKeyState(state),
    favoritePairs,
    mode: getCurrentMode(state),
    isPaperTrading: getIsPaperTrading(state),
    isOrderExecuting: getIsOrderExecuting(state),
    aoParams: getAOParams(state),
    maxOrderCounts: getMaxOrderCounts(state),
  }
}

const mapDispatchToProps = dispatch => ({
  navigate: (route) => {
    dispatch(push(route))
  },

  setIsOrderExecuting: (executing) => {
    dispatch(UIActions.setIsOrderExecuting(executing))
  },

  saveState: (componentID, state) => {
    dispatch(UIActions.saveComponentState({
      state,
      componentID,
    }))
  },

  submitOrder: ({ authToken, packet }) => {
    debug('submitting order %j', packet)

    dispatch(WSActions.submitOrder(authToken, {
      symbol: packet.symbol.w,
      ...packet,
    }))
  },
  gaSubmitOrder: () => {
    dispatch(GAActions.submitAtomicOrder())
  },
  gaSubmitAO: () => {
    dispatch(GAActions.submitAO())
  },
  submitAlgoOrder: ({
    authToken, id, market, context, data,
  }) => {
    debug('submitting algo order %s on %s [%s]', id, market.uiID, context)

    dispatch(WSActions.submitAlgoOrder(authToken, id, {
      ...data,
      _symbol: market.wsID,
      _margin: context === 'm',
      _futures: context === 'f',
    }))
  },

  submitAPIKeys: ({
    authToken, apiKey, apiSecret,
  }, mode) => {
    dispatch(WSActions.updatingApiKey(mode, true))
    dispatch(WSActions.send([
      'api_credentials.save',
      authToken,
      apiKey,
      apiSecret,
      mode,
      mode,
      getScope(),
    ]))
  },

  savePairs: (pairs, authToken, mode) => {
    dispatch(WSActions.send([
      'favourite_trading_pairs.save',
      authToken,
      pairs,
      mode,
    ]))
  },

  getAlgoOrderParams: (aoID, symbol) => {
    dispatch(AOActions.getAlgoOrderParams(aoID, symbol))
  },

  resetActiveAOParamsID: () => {
    dispatch(AOActions.setActiveAOParamsID(null))
  },
})

export default compose(withTranslation(), connect(mapStateToProps, mapDispatchToProps))(OrderForm)
