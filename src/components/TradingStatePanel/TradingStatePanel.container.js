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
import AOActions from '../../redux/actions/ao'
import { getCurrentMode } from '../../redux/selectors/ui'
import { getShowAOsHistory } from '../../redux/selectors/ao'

import TradingStatePanel from './TradingStatePanel'

const mapStateToProps = (state = {}) => ({
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
  getCurrencySymbol: reduxSelectors.getCurrencySymbolMemo(state),
})

const mapDispatchToProps = (dispatch) => ({
  setShowAOsHistory: (showAOsHistory) => {
    dispatch(AOActions.setShowAOsHistory(showAOsHistory))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(TradingStatePanel)
