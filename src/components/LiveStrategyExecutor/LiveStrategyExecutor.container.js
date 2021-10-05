import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import { getMarkets } from '../../redux/selectors/meta'
import { getAuthToken } from '../../redux/selectors/ws'
import LiveStrategyExecutor from './LiveStrategyExecutor'

const mapStateToProps = (state = {}) => ({
  markets: getMarkets(state),
  strategyContent: state.ui.content,
  isExecuting: state.ws.execution.executing,
  isLoading: state.ws.execution.loading,
  options: state.ws.execution.options,
  authToken: getAuthToken(state),
})

const mapDispatchToProps = (dispatch) => ({
  dsExecuteLiveStrategy: (authToken, symbol, tf, includeTrades, strategy, seedCandleCount) => {
    dispatch(WSActions.setExecutionOptions({
      includeTrades, seedCandleCount, symbol, tf,
    }))
    dispatch(WSActions.send(['strategy.execute_start', authToken, symbol, tf, includeTrades, strategy, seedCandleCount]))
    dispatch(WSActions.setExecutionLoading(true))
  },
  dsStopLiveStrategy: (authToken) => {
    dispatch(WSActions.setExecutionLoading(true))
    dispatch(WSActions.send(['strategy.execute_stop', authToken]))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(LiveStrategyExecutor)
