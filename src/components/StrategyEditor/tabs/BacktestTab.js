import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

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

export const BACKTEST_TAB_SECTIONS = {
  NEW_BT: 'NEW_BT',
  NEW_BT_RESULTS: 'NEW_BT _RESULTS',
  HISTORY_BT_LIST: 'HISTORY_BT_LIST',
  HISTORY_BT_DETAILS: 'HISTORY_BT_DETAILS',
  HISTORY_BT_RESULTS: 'HISTORY_BT_RESULTS',
}

const BacktestTab = (props) => {
  const {
    results,
    onCancelProcess,
    strategy,
    indicators,
    markets,
    onBacktestStart,
    saveStrategyOptions,
  } = props
  const { t } = useTranslation()

  const [activeSection, setActiveSection] = useState(
    BACKTEST_TAB_SECTIONS.NEW_BT,
  )
  const [btHistoryId, setBtHistoryId] = useState(null)
  const [layoutConfig, setLayoutConfig] = useState()

  const [fullscreenChart, , showFullscreenChart, hideFullscreenChart] = useToggle(false)

  const {
    finished = false, loading, progressPerc, gid, timestamp,
  } = results
  // const loading = true
  const positions = results?.strategy?.closedPositions

  const trades = useMemo(() => prepareChartTrades(positions), [positions])
  const showBacktestResults = activeSection === BACKTEST_TAB_SECTIONS.NEW_BT_RESULTS
    || activeSection === BACKTEST_TAB_SECTIONS.HISTORY_BT_RESULTS

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
  }, [finished])

  const renderGridComponents = useCallback(
    (i) => {
      switch (i) {
        case COMPONENTS_KEYS.OPTIONS:
          return showBacktestResults ? (
            <BacktestResultsOptionsPanel
              showFullscreenChart={showFullscreenChart}
              backtestTimestamp={timestamp}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          ) : (
            <BacktestOptionsPanel
              strategy={strategy}
              onBacktestStart={onBacktestStart}
              saveStrategyOptions={saveStrategyOptions}
              isLoading={loading}
              onCancelProcess={onCancelProcess}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              setBtHistoryId={setBtHistoryId}
              btHistoryId={btHistoryId}
            />
          )

        case COMPONENTS_KEYS.LIVE_CHART:
          return (
            <StrategyLiveChart
              indicators={indicators}
              markets={markets}
              strategy={strategy}
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
      timestamp,
      activeSection,
      strategy,
      onBacktestStart,
      saveStrategyOptions,
      loading,
      onCancelProcess,
      btHistoryId,
      indicators,
      markets,
      fullscreenChart,
      hideFullscreenChart,
      trades,
      results,
      positions,
      layoutConfig,
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
              {t('strategyEditor.backtestingStartingMessage')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

BacktestTab.propTypes = {
  results: PropTypes.shape({
    finished: PropTypes.bool,
    loading: PropTypes.bool,
    strategy: PropTypes.shape({
      closedPositions: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.object,
      ]),
    }),
    progressPerc: PropTypes.number,
    gid: PropTypes.number,
    timestamp: PropTypes.number,
  }).isRequired,
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
