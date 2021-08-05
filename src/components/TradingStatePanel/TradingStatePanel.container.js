import { connect } from 'react-redux'

import {
  getFilteredPositionsCount,
  getFilteredAtomicOrdersCount,
  getFilteredAlgoOrdersCount,
} from '../../redux/selectors/ws'
import { getMarkets } from '../../redux/selectors/meta'

import TradingStatePanel from './TradingStatePanel'

const mapStateToProps = (state = {}) => ({
  getPositionsCount: getFilteredPositionsCount(state),
  getAtomicOrdersCount: getFilteredAtomicOrdersCount(state),
  getAlgoOrdersCount: getFilteredAlgoOrdersCount(state),
  markets: getMarkets(state),
})

export default connect(mapStateToProps)(TradingStatePanel)
