import { connect } from 'react-redux'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import {
  getFilteredPositionsCount,
  getFilteredAtomicOrdersCount,
  getAuthToken,
  getCurrentModeAlgoOrders,
  getCurrentModeActiveAlgoOrders,
  getAllPositions,
  getAtomicOrders,
} from '../../redux/selectors/ws'
import { getMarkets } from '../../redux/selectors/meta'
import UIActions from '../../redux/actions/ui'
import AOActions from '../../redux/actions/ao'
import { getComponentState, getCurrentMode } from '../../redux/selectors/ui'
import { getShowAOsHistory } from '../../redux/selectors/ao'

import TradingStatePanel from './TradingStatePanel'

const mapStateToProps = (state = {}, { layoutID, layoutI: id } = {}) => ({
  authToken: getAuthToken(state),
  currentMode: getCurrentMode(state),
  getPositionsCount: getFilteredPositionsCount(state),
  getAtomicOrdersCount: getFilteredAtomicOrdersCount(state),
  algoOrders: getCurrentModeAlgoOrders(state),
  activeAlgoOrders: getCurrentModeActiveAlgoOrders(state),
  isHistoryActive: getShowAOsHistory(state),
  positions: getAllPositions(state),
  atomicOrders: getAtomicOrders(state),
  markets: getMarkets(state),
  savedState: getComponentState(state, layoutID, 'trading_state', id),
  getCurrencySymbol: reduxSelectors.getCurrencySymbolMemo(state),
})

const mapDispatchToProps = (dispatch) => ({
  updateState: (layoutID, componentID, state) => {
    dispatch(
      UIActions.updateComponentState({
        state,
        layoutID,
        componentID,
      }),
    )
  },
  setShowAOsHistory: (showAOsHistory) => {
    dispatch(AOActions.setShowAOsHistory(showAOsHistory))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(TradingStatePanel)
