import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import _isArray from 'lodash/isArray'

import StrategyPerfomanceMetrics from '../../StrategyPerfomanceMetrics'
import useToggle from '../../../hooks/useToggle'
import StrategyTradesTable from '../../StrategyTradesTable'
import StrategiesGridLayout from '../components/StrategiesGridLayout'
import {
  BACKTEST_LAYOUT_CONFIG_NO_DATA,
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
} from '../components/StrategiesGridLayout.constants'
import StrategyLiveChart from '../../StrategyLiveChart'
import BacktestOptionsPanel from '../../BacktestOptionsPanel'
import { prepareChartTrades } from '../StrategyEditor.helpers'
import {
  INDICATORS_ARRAY_SHAPE,
  MARKET_SHAPE,
  STRATEGY_SHAPE,
} from '../../../constants/prop-types-shapes'
import BacktestResultsOptionsPanel from '../../BacktestOptionsPanel/BacktestResultsOptionsPanel'
import BacktestProgressBar from '../../BacktestProgressBar'
import WSActions from '../../../redux/actions/ws'
import UIActions from '../../../redux/actions/ui'
import WSTypes from '../../../redux/constants/ws'
import {
  getBacktestState,
  getCurrentHistoryBacktest,
  getCurrentStrategyBacktestsList,
} from '../../../redux/selectors/ws'
import { BACKTEST_TAB_SECTIONS } from '../../../redux/reducers/ui'
import { getBacktestActiveSection } from '../../../redux/selectors/ui'

const getInitialMessageI18Key = (activeSection) => {
  if (activeSection === BACKTEST_TAB_SECTIONS.NEW_BT) {
    return 'strategyEditor.backtestingStartingMessage'
  }
  if (activeSection === BACKTEST_TAB_SECTIONS.HISTORY_BT_LIST) {
    return 'strategyEditor.backtestingHistoryListMessage'
  }
  if (activeSection === BACKTEST_TAB_SECTIONS.HISTORY_BT_DETAILS) {
    return 'strategyEditor.backtestingHistoryDetailsMessage'
  }
  return ''
}

const BacktestTab = (props) => {
  const {
    onCancelProcess,
    strategy,
    indicators,
    markets,
    onBacktestStart,
    saveStrategyOptions,
  } = props
  const [layoutConfig, setLayoutConfig] = useState()
  const [fullscreenChart, , showFullscreenChart, hideFullscreenChart] = useToggle(false)

  const isBacktestListFetched = _isArray(
    useSelector(getCurrentStrategyBacktestsList),
  )
  const activeSection = useSelector(getBacktestActiveSection)
  const backtestState = useSelector(getBacktestState)
  const currentHistoryBacktest = useSelector(getCurrentHistoryBacktest)

  const {
    finished = false,
    loading,
    progressPerc,
    gid,
    results,
  } = backtestState
  const { id: strategyId } = strategy
  const positions = results?.strategy?.closedPositions

  const trades = useMemo(() => prepareChartTrades(positions), [positions])
  const showBacktestResults = activeSection === BACKTEST_TAB_SECTIONS.NEW_BT_RESULTS
    || activeSection === BACKTEST_TAB_SECTIONS.HISTORY_BT_RESULTS

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const setActiveSection = useCallback(
    (section) => {
      dispatch(UIActions.setBacktestActiveSection(section))
    },
    [dispatch],
  )

  useEffect(() => {
    if (!showBacktestResults) {
      setLayoutConfig(BACKTEST_LAYOUT_CONFIG_NO_DATA)
      return
    }
    setLayoutConfig(LAYOUT_CONFIG)
  }, [showBacktestResults])

  useEffect(() => {
    if (finished) {
      setActiveSection(BACKTEST_TAB_SECTIONS.NEW_BT_RESULTS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  // Fetch BT history list
  useEffect(() => {
    if (!isBacktestListFetched) {
      dispatch(
        WSActions.send({
          alias: WSTypes.ALIAS_DATA_SERVER,
          data: ['get.bt.history.list', strategyId],
        }),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId])

  const renderGridComponents = useCallback(
    (i) => {
      const {
        timeframe, symbol, candleSeed, start, end, executionId,
      } = currentHistoryBacktest
      const chartOptions = {
        timeframe,
        symbol,
        candleSeed,
        executionId,
        start,
        end,
      }

      switch (i) {
        case COMPONENTS_KEYS.OPTIONS:
          return showBacktestResults ? (
            <BacktestResultsOptionsPanel
              showFullscreenChart={showFullscreenChart}
            />
          ) : (
            <BacktestOptionsPanel
              strategy={strategy}
              onBacktestStart={onBacktestStart}
              saveStrategyOptions={saveStrategyOptions}
              isLoading={loading}
              onCancelProcess={onCancelProcess}
            />
          )

        case COMPONENTS_KEYS.LIVE_CHART:
          return (
            <StrategyLiveChart
              indicators={indicators}
              markets={markets}
              options={chartOptions}
              fullscreenChart={fullscreenChart}
              exitFullscreenChart={hideFullscreenChart}
              trades={trades}
              isBacktest
              isExecuting={false}
            />
          )

        case COMPONENTS_KEYS.STRATEGY_PERFOMANCE:
          return (
            <StrategyPerfomanceMetrics
              results={results}
              isLoading={loading}
              isBacktest
            />
          )

        case COMPONENTS_KEYS.STRATEGY_TRADES:
          return (
            <StrategyTradesTable
              results={positions}
              setLayoutConfig={setLayoutConfig}
              layoutConfig={layoutConfig}
              strategy={strategy}
            />
          )

        default:
          return null
      }
    },
    [
      showBacktestResults,
      showFullscreenChart,
      strategy,
      onBacktestStart,
      saveStrategyOptions,
      loading,
      onCancelProcess,
      indicators,
      markets,
      fullscreenChart,
      hideFullscreenChart,
      trades,
      results,
      positions,
      layoutConfig,
      currentHistoryBacktest,
    ],
  )

  return (
    <div className='hfui-strategyeditor__wrapper'>
      <StrategiesGridLayout
        layoutConfig={layoutConfig}
        renderGridComponents={renderGridComponents}
      />
      {!showBacktestResults && (
        <div className='hfui-strategyeditor__backtest-tab-empty'>
          {loading ? (
            <BacktestProgressBar percent={progressPerc} startedOn={gid} />
          ) : (
            <p className='hfui-strategyeditor__initial-message'>
              {t(getInitialMessageI18Key(activeSection))}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

BacktestTab.propTypes = {
  onCancelProcess: PropTypes.func.isRequired,
  strategy: PropTypes.shape(STRATEGY_SHAPE).isRequired,
  markets: PropTypes.arrayOf(PropTypes.shape(MARKET_SHAPE)).isRequired,
  indicators: INDICATORS_ARRAY_SHAPE,
  onBacktestStart: PropTypes.func.isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
}

BacktestTab.defaultProps = {
  indicators: [],
}

export default BacktestTab
