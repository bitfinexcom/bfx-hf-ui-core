import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import _omitBy from 'lodash/omitBy'
import _isEmpty from 'lodash/isEmpty'

import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import GAActions from '../../redux/actions/google_analytics'
import WSTypes from '../../redux/constants/ws'
import {
  getAuthToken,
  getBacktestResults,
  getExecutionResults,
  // getSortedByTimeActiveStrategies,
  getRunningStrategiesMapping,
  getLiveExecutionResults,
  getIsCurrentStrategyExecuting,
  getSavedStrategies,
} from '../../redux/selectors/ws'
import {
  getThemeSetting,
  getIsPaperTrading,
  getStrategiesFeatureFlags,
  getIsBetaVersion,
  getCurrentMode,
} from '../../redux/selectors/ui'
import StrategyEditor from './StrategyEditor'
import { getMarketsForExecution } from '../../redux/selectors/meta'

const mapStateToProps = (state = {}) => {
  return {
    authToken: getAuthToken(state),
    backtestResults: getBacktestResults(state),
    allExecutionResults: getExecutionResults(state),
    settingsTheme: getThemeSetting(state),
    executing: getIsCurrentStrategyExecuting(state),
    markets: getMarketsForExecution(state),
    isPaperTrading: getIsPaperTrading(state),
    flags: getStrategiesFeatureFlags(state),
    isBetaVersion: getIsBetaVersion(state),
    liveResults: getLiveExecutionResults(state),
    // activeStrategies: getSortedByTimeActiveStrategies(state),
    runningStrategiesMapping: getRunningStrategiesMapping(state),
    savedStrategies: getSavedStrategies(state),
    currentMode: getCurrentMode(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
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
  dsExecuteLiveStrategy: ({
    authToken,
    label,
    symbol,
    timeframe,
    // trades,
    strategy,
    candleSeed,
    margin,
    constraints,
  }) => {
    const processedStrategy = _omitBy(strategy, _isEmpty)

    dispatch(
      WSActions.send([
        'strategy.execute_start',
        authToken,
        label,
        symbol,
        timeframe,
        false, // trades
        processedStrategy,
        candleSeed,
        margin,
        constraints,
      ]),
    )
    dispatch(WSActions.setExecutionLoading(true))
  },
  dsExecuteBacktest: ({
    startNum,
    endNum,
    symbol,
    timeframe,
    candles,
    trades,
    strategy,
    constraints,
  }) => {
    const processedStrategy = _omitBy(strategy, _isEmpty)

    dispatch(WSActions.purgeBacktestData())
    dispatch(
      WSActions.send({
        alias: WSTypes.ALIAS_DATA_SERVER,
        data: [
          'exec.str',
          [
            'bitfinex',
            startNum,
            endNum,
            symbol,
            timeframe,
            candles,
            trades,
            true,
            processedStrategy,
            uuidv4(),
            constraints,
          ],
        ],
      }),
    )
    dispatch(WSActions.setBacktestLoading())
  },
  dsStopLiveStrategy: (authToken, runningStrategyID) => {
    dispatch(WSActions.setExecutionLoading(true))
    dispatch(
      WSActions.send(['strategy.execute_stop', authToken, runningStrategyID]),
    )
  },
  showError: (text) => {
    dispatch(
      UIActions.recvNotification({
        mts: Date.now(),
        status: 'error',
        text,
        cid: uuidv4(),
      }),
    )
  },
  changeTradingMode: (isPaperTrading, authToken, currentMode) => {
    dispatch(UIActions.setTradingMode(isPaperTrading))
    dispatch(WSActions.send(['algo_order.pause', authToken, currentMode]))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategyEditor)
