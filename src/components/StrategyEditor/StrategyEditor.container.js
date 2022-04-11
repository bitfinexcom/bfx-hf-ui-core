import { connect } from 'react-redux'
import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import GAActions from '../../redux/actions/google_analytics'
import { getAuthToken, getBacktestResults, getExecutionOptions } from '../../redux/selectors/ws'
import { getStrategyId, getThemeSetting, getIsPaperTrading } from '../../redux/selectors/ui'

import StrategyEditor from './StrategyEditor'
import { getMarkets } from '../../redux/selectors/meta'

const mapStateToProps = (state = {}) => ({
  authToken: getAuthToken(state),
  strategyId: getStrategyId(state),
  backtestResults: getBacktestResults(state),
  liveExecuting: state.ws.execution.executing,
  liveLoading: state.ws.execution.loading,
  settingsTheme: getThemeSetting(state),
  options: getExecutionOptions(state),
  markets: getMarkets(state),
  isPaperTrading: getIsPaperTrading(state),
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
  dsExecuteLiveStrategy: (authToken, name, symbol, tf, includeTrades, strategy, seedCandleCount, margin) => {
    dispatch(WSActions.setExecutionOptions({
      includeTrades, seedCandleCount, symbol, tf, margin,
    }))
    dispatch(WSActions.send(['strategy.execute_start', authToken, name, symbol, tf, includeTrades, strategy, seedCandleCount, margin]))
    dispatch(WSActions.setExecutionLoading(true))
  },
  dsStopLiveStrategy: (authToken) => {
    dispatch(WSActions.setExecutionLoading(true))
    dispatch(WSActions.send(['strategy.execute_stop', authToken]))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategyEditor)
