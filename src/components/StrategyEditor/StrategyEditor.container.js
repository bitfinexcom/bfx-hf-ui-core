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
  getExecutionOptions,
  getExecutionResults,
  // getSortedByTimeActiveStrategies,
  getRunningStrategiesMapping,
  getLiveExecutionResults,
  getIsStrategyExecuting,
} from '../../redux/selectors/ws'
import {
  getStrategyId,
  getThemeSetting,
  getIsPaperTrading,
  getStrategiesFeatureFlags,
  getIsBetaVersion,
} from '../../redux/selectors/ui'
import StrategyEditor from './StrategyEditor'
import { getMarkets } from '../../redux/selectors/meta'

const mapStateToProps = (state = {}) => {
  const strategyId = getStrategyId(state)

  return {
    authToken: getAuthToken(state),
    strategyId,
    backtestResults: getBacktestResults(state),
    allExecutionResults: getExecutionResults(state),
    settingsTheme: getThemeSetting(state),
    options: getExecutionOptions(state)(strategyId),
    executing: getIsStrategyExecuting(state)(strategyId),
    markets: getMarkets(state),
    isPaperTrading: getIsPaperTrading(state),
    flags: getStrategiesFeatureFlags(state),
    isBetaVersion: getIsBetaVersion(state),
    liveResults: getLiveExecutionResults(state),
    // activeStrategies: getSortedByTimeActiveStrategies(state),
    runningStrategiesMapping: getRunningStrategiesMapping(state),
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
  dsExecuteLiveStrategy: (
    authToken,
    strategyId,
    name,
    symbol,
    tf,
    includeTrades,
    strategy,
    seedCandleCount,
    margin,
    isPaperTrading,
  ) => {
    const processedStrategy = _omitBy(strategy, _isEmpty)
    const executionOptions = {
      authToken,
      name,
      symbol,
      tf,
      includeTrades,
      strategy: processedStrategy,
      seedCandleCount,
      margin,
    }

    if (isPaperTrading) {
      dispatch(
        WSActions.setExecutionOption(strategyId, {
          includeTrades,
          seedCandleCount,
          symbol,
          tf,
          margin,
        }),
      )
      dispatch(
        WSActions.send([
          'strategy.execute_start',
          authToken,
          name,
          symbol,
          tf,
          includeTrades,
          processedStrategy,
          seedCandleCount,
          margin,
        ]),
      )
      dispatch(WSActions.setExecutionLoading(true))
    } else {
      dispatch(
        UIActions.changeLaunchStrategyModalState(true, executionOptions),
      )
    }
  },
  dsExecuteBacktest: (from, to, symbol, tf, candles, trades, strategy) => {
    const processedStrategy = _omitBy(strategy, _isEmpty)

    dispatch(WSActions.purgeBacktestData())
    dispatch(
      WSActions.send({
        alias: WSTypes.ALIAS_DATA_SERVER,
        data: [
          'exec.str',
          [
            'bitfinex',
            from,
            to,
            symbol,
            tf,
            candles,
            trades,
            true,
            processedStrategy,
            uuidv4(),
          ],
        ],
      }),
    )
    dispatch(WSActions.setBacktestLoading())
  },
  setBacktestOptions: (options) => {
    dispatch(WSActions.setBacktestOptions(options))
  },
  dsStopLiveStrategy: (authToken, runningStrategyID) => {
    dispatch(WSActions.setExecutionLoading(true))
    dispatch(WSActions.send(['strategy.execute_stop', authToken, runningStrategyID]))
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
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategyEditor)
