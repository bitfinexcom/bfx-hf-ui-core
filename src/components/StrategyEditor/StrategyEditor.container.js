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
  getBacktestState,
  getCurrentStrategyExecutionState,
  getSavedStrategies,
} from '../../redux/selectors/ws'
import {
  getThemeSetting,
  getIsPaperTrading,
  getStrategiesFeatureFlags,
  getIsBetaVersion,
  getCurrentMode,
  getStrategyExecutionId,
  getServicesStatus,
  getUIState,
} from '../../redux/selectors/ui'
import StrategyEditor from './StrategyEditor'
import { getMarketsSortedByVolumeForExecution } from '../../redux/selectors/meta'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import { LOG_LEVELS } from '../../constants/logging'

const mapStateToProps = (state = {}) => {
  return {
    authToken: getAuthToken(state),
    backtestState: getBacktestState(state),
    executionState: getCurrentStrategyExecutionState(state),
    settingsTheme: getThemeSetting(state),
    isPaperTrading: getIsPaperTrading(state),
    flags: getStrategiesFeatureFlags(state),
    isBetaVersion: getIsBetaVersion(state),
    savedStrategies: getSavedStrategies(state),
    currentMode: getCurrentMode(state),
    executionId: getStrategyExecutionId(state),
    pendingLiveStrategy: getUIState(state, UI_KEYS.pendingLiveStrategy, null),
    serviceStatus: getServicesStatus(state),
    markets: getMarketsSortedByVolumeForExecution(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onRemove: (authToken, id) => {
    dispatch(UIActions.removeStrategy(authToken, id))
  },
  gaCreateStrategy: () => {
    dispatch(GAActions.createStrategy())
  },
  dsExecuteLiveStrategy: ({
    authToken,
    label,
    id,
    strategyType,
    symbol,
    timeframe,
    trades,
    strategyContent,
    candleSeed,
    margin,
    constraints,
    leverageSettings,
    stopOrderSettings,
  }) => {
    const processedStrategy = _omitBy(strategyContent, _isEmpty)

    dispatch(
      WSActions.send([
        'strategy.execute_start',
        authToken,
        id,
        label,
        symbol,
        timeframe,
        trades,
        processedStrategy,
        strategyType,
        candleSeed,
        margin,
        constraints,
        leverageSettings,
        stopOrderSettings,
      ]),
    )
    dispatch(UIActions.logInformation(`Strategy (${label}) is active and running`, LOG_LEVELS.INFO, 'strategy_init'))
    dispatch(WSActions.setExecutionLoading(true))
  },
  dsExecuteBacktest: (data) => {
    const {
      startNum,
      endNum,
      symbol,
      timeframe,
      candles,
      trades,
      candleSeed,
      strategyContent,
      constraints,
      label,
      id,
      leverageSettings,
      stopOrderSettings,
      margin,
    } = data
    const processedStrategy = _omitBy(strategyContent, _isEmpty)
    const sync = true

    dispatch(WSActions.purgeBacktestData())
    dispatch(
      WSActions.send({
        alias: WSTypes.ALIAS_DATA_SERVER,
        data: [
          'exec.str',
          [
            'bitfinex',
            id,
            startNum,
            endNum,
            symbol,
            timeframe,
            candles,
            trades,
            candleSeed,
            sync,
            margin,
            processedStrategy,
            uuidv4(),
            constraints,
            leverageSettings,
            stopOrderSettings,
          ],
        ],
      }),
    )
    dispatch(WSActions.setBacktestLoading())
    dispatch(UIActions.logInformation(`New backtest initiated for draft ${label}`, LOG_LEVELS.INFO, 'backtest_start', data))
  },
  dsStopLiveStrategy: (authToken, liveExecGid) => {
    dispatch(WSActions.setExecutionLoading(true))
    dispatch(
      WSActions.send(['strategy.execute_stop', authToken, liveExecGid]),
    )
    dispatch(UIActions.logInformation(`Strategy (${liveExecGid}) was stopped by the user and is no longer trading`, LOG_LEVELS.INFO, 'strategy_stopped'))
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
  cancelProcess: (authToken, isPaperTrading, backtestGid, liveExecGid) => {
    if (isPaperTrading) {
      // stopping backtesting
      if (!backtestGid) {
        dispatch(WSActions.purgeBacktestData())
        return
      }
      dispatch(
        WSActions.send({
          alias: WSTypes.ALIAS_DATA_SERVER,
          data: ['stop.bt', backtestGid],
        }),
      )
      dispatch(UIActions.logInformation('Backtest cancelled by the user', LOG_LEVELS.INFO, 'backtest_cancelled'))
    } else {
      if (!liveExecGid) {
        dispatch(WSActions.resetExecutionData())
        return
      }
      // stopping live execution
      dispatch(
        WSActions.send(['strategy.execute_stop', authToken, liveExecGid]),
      )
      dispatch(UIActions.logInformation(`Strategy (${liveExecGid}) was stopped by the user and is no longer trading`, LOG_LEVELS.INFO, 'strategy_stopped'))
    }
  },
  changeTradingMode: (isPaperTrading) => {
    dispatch(UIActions.changeMode(isPaperTrading))
  },
  saveStrategyToExecuteToLS: (strategyToExecute) => {
    dispatch(UIActions.setUIValue(UI_KEYS.pendingLiveStrategy, strategyToExecute.id))
  },
  removeStrategyToExecuteFromLS: () => {
    dispatch(UIActions.setUIValue(UI_KEYS.pendingLiveStrategy, null))
  },
  logInformation: (message, level, action, trace) => {
    dispatch(UIActions.logInformation(message, level, action, trace))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategyEditor)
