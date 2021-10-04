import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import { getMarkets } from '../../redux/selectors/meta'
import { getAuthToken } from '../../redux/selectors/ws'
import LiveStrategyExecutor from './LiveStrategyExecutor'

const mapStateToProps = (state = {}) => ({
  markets: getMarkets(state),
  strategyContent: state.ui.content,
  isExecuting: state.ws.execution.executing,
  authToken: getAuthToken(state),
})

const mapDispatchToProps = (dispatch) => ({
  dsExecuteLiveStrategy: (authToken, symbol, tf, trades, strategy, seedCandles = 150) => {
    dispatch(WSActions.resetExecutionData())
    dispatch(WSActions.send(['strategy.execute_start', authToken, symbol, tf, trades, strategy, seedCandles]))
    dispatch(WSActions.startLiveExecution())
  },
  dsStopLiveStrategy: (authToken) => {
    dispatch(WSActions.stopLiveExecution())
    dispatch(WSActions.send(['strategy.execute_stop', authToken]))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(LiveStrategyExecutor)
