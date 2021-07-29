import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import {
  getAlgoOrders,
  getPositionsCount,
  getFilteredAtomicOrdersCount,
} from '../../redux/selectors/ws'
import { getMarkets } from '../../redux/selectors/meta'
import {
  getAlgoOrdersCount,
} from '../../redux/selectors/ui'

import TradingStatePanel from './TradingStatePanel'

const mapStateToProps = (state = {}) => ({
  algoOrders: getAlgoOrders(state),
  algoOrdersCount: getAlgoOrdersCount(state),
  getAtomicOrdersCount: getFilteredAtomicOrdersCount(state),
  getPositionsCount: getPositionsCount(state),
  markets: getMarkets(state),
})

const mapDispatchToProps = dispatch => ({
  setFilteredValueWithKey: (key, value) => {
    dispatch(UIActions.setFilteredValueWithKey(key, value))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(TradingStatePanel)
