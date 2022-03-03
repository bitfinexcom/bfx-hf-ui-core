import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import { getMarkets } from '../../redux/selectors/meta'
import {
  getIsPaperTrading, getThemeSetting,
} from '../../redux/selectors/ui'
import { getAuthToken } from '../../redux/selectors/ws'

import LiveStrategyExecutor from './LiveStrategyExecutor'

const mapStateToProps = (state = {}) => ({
  markets: getMarkets(state),
  strategyContent: state.ui.content,
  isExecuting: state.ws.execution.executing,
  isLoading: state.ws.execution.loading,
  options: state.ws.execution.options,
  authToken: getAuthToken(state),
  isPaperTrading: getIsPaperTrading(state),
  results: state.ws.execution.results,
  theme: getThemeSetting(state),
})

const mapDispatchToProps = (dispatch) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveStrategyExecutor)
