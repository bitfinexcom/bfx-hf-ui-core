import { connect } from 'react-redux'
import {
  getCurrentStrategy,
  getIsPaperTrading,
  getIsStrategyDirty,
} from '../../redux/selectors/ui'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { getAuthToken, getBacktestResults } from '../../redux/selectors/ws'

import StrategiesPage from './Strategies'

const mapStateToProps = (state) => ({
  authToken: getAuthToken(state),
  strategy: getCurrentStrategy(state),
  backtestResults: getBacktestResults(state),
  strategyDirty: getIsStrategyDirty(state),
  isPaperTrading: getIsPaperTrading(state),
})

const mapDispatchToProps = (dispatch) => ({
  setStrategy(strategy) {
    dispatch(UIActions.setCurrentStrategy(strategy))
  },
  onSave: (authToken, strategy = {}) => {
    dispatch(WSActions.send(['strategy.save', authToken, strategy]))
  },
  onRemove: (authToken, id) => {
    dispatch(UIActions.removeStrategy(authToken, id))
  },
  setStrategyDirty: (value) => dispatch(UIActions.setIsStrategyDirty(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategiesPage)
