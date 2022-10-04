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

const mapStateToProps = (state = {}) => {
  return {
    authToken: getAuthToken(state),
    backtestResults: getBacktestResults(state),
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
    candleSeed,
    strategyContent,
    constraints,
  }) => {
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
            startNum,
            endNum,
            symbol,
            timeframe,
            candles,
            trades,
            candleSeed,
            sync,
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
    } else {
      if (!liveExecGid) {
        dispatch(WSActions.resetExecutionData())
        return
      }
      // stopping live execution
      dispatch(
        WSActions.send(['strategy.execute_stop', authToken, liveExecGid]),
      )
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
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategyEditor)
