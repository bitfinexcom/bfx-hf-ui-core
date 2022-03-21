import { connect } from 'react-redux'
import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import GAActions from '../../redux/actions/google_analytics'
import { getAuthToken, getBacktestResults } from '../../redux/selectors/ws'
import { getStrategyId, getThemeSetting } from '../../redux/selectors/ui'

import StrategyEditor from './StrategyEditor'

const mapStateToProps = (state = {}) => ({
  authToken: getAuthToken(state),
  strategyId: getStrategyId(state),
  backtestResults: getBacktestResults(state),
  liveExecuting: state.ws.execution.executing,
  liveLoading: state.ws.execution.loading,
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = dispatch => ({
  onRemove: (authToken, id) => {
    dispatch(WSActions.send(['strategy.remove', authToken, id]))
    dispatch(WSActions.resetBacktestData())
    dispatch(UIActions.clearStrategies())
  },
  gaCreateStrategy: () => {
    dispatch(GAActions.createStrategy())
  },
  clearBacktestOptions: () => {
    dispatch(WSActions.resetBacktestData())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategyEditor)
