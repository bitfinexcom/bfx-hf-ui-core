import { connect } from 'react-redux'
import { compose } from 'redux'
import { push } from 'connected-react-router'
import Debug from 'debug'

import { withTranslation } from 'react-i18next'
import OrderForm from './OrderForm'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import AOActions from '../../redux/actions/ao'
import { getAOParams } from '../../redux/selectors/ao'
import {
  getAPIClientState, getAuthToken, getCurrentModeAPIKeyState,
} from '../../redux/selectors/ws'
import {
  getComponentState, getActiveMarket, getCurrentMode, getIsPaperTrading, getIsOrderExecuting, getIsAnyModalIsOpen,
} from '../../redux/selectors/ui'

const debug = Debug('hfui:c:order-form')

const mapStateToProps = (state = {}, ownProps = {}) => {
  const { layoutID, layoutI: id } = ownProps
  const { ws = {} } = state
  const { favoriteTradingPairs = {} } = ws
  const { favoritePairs = [] } = favoriteTradingPairs
  return {
    activeMarket: getActiveMarket(state),
    apiClientState: getAPIClientState(state),
    savedState: getComponentState(state, layoutID, 'orderform', id),
    authToken: getAuthToken(state),
    apiCredentials: getCurrentModeAPIKeyState(state),
    favoritePairs,
    mode: getCurrentMode(state),
    isPaperTrading: getIsPaperTrading(state),
    isOrderExecuting: getIsOrderExecuting(state),
    aoParams: getAOParams(state),
    isAnyModalIsOpened: getIsAnyModalIsOpen(state),
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

    dispatch(WSActions.send(['order.submit', authToken, 'bitfinex', {
      symbol: packet.symbol.w,
      ...packet,
    }]))
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

    dispatch(WSActions.send(['algo_order.submit', authToken, 'bitfinex', id, {
      ...data,
      _symbol: market.wsID,
      _margin: context === 'm',
      _futures: context === 'f',
    }]))
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
