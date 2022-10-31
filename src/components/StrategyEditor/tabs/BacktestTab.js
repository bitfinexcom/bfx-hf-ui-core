import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import _sortBy from 'lodash/sortBy'
import _values from 'lodash/values'
import _last from 'lodash/last'

import clsx from 'clsx'
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

const BacktestTab = (props) => {
  const {
    results,
    onCancelProcess,
    strategy,
    indicators,
    markets,
    onBacktestStart,
    saveStrategyOptions,
    openNewTest,
  } = props
  const { t } = useTranslation()
  const [layoutConfig, setLayoutConfig] = useState()
  const [fullscreenChart, , showFullscreenChart, hideFullscreenChart] = useToggle(false)

  const { finished = false, loading } = results
  const positions = results?.strategy?.closedPositions
  const position = _last(_sortBy(_values(positions), 'entryAt'))

  const trades = useMemo(() => prepareChartTrades(positions), [positions])

  useEffect(() => {
    if (!finished) {
      setLayoutConfig(BACKTEST_LAYOUT_CONFIG_NO_DATA)
      return
    }
    setLayoutConfig(LAYOUT_CONFIG)
  }, [finished])

  const renderGridComponents = useCallback(
    (i) => {
      switch (i) {
        case COMPONENTS_KEYS.OPTIONS:
          return finished ? (
            <BacktestResultsOptionsPanel
              showFullscreenChart={showFullscreenChart}
              openNewTest={openNewTest}
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
              lastOpenPosition={position}
              markets={markets}
              strategy={strategy}
              fullscreenChart={fullscreenChart}
              exitFullscreenChart={hideFullscreenChart}
              trades={trades}
              isBacktest
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
      finished,
      showFullscreenChart,
      openNewTest,
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
    ],
  )

  return (
    <div className='hfui-strategyeditor__wrapper'>
      <StrategiesGridLayout
        layoutConfig={layoutConfig}
        renderGridComponents={renderGridComponents}
      />
      {!finished && (
        <p
          className={clsx('hfui-strategyeditor__initial-message', {
            blur: loading,
          })}
        >
          {t('strategyEditor.backtestingStartingMessage')}
        </p>
      )}
    </div>
  )
}

BacktestTab.propTypes = {
  results: PropTypes.shape({
    finished: PropTypes.bool,
    loading: PropTypes.bool,
    strategy: PropTypes.shape({
      closedPositions: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  onCancelProcess: PropTypes.func.isRequired,
  strategy: PropTypes.shape(STRATEGY_SHAPE).isRequired,
  markets: PropTypes.arrayOf(PropTypes.shape(MARKET_SHAPE)).isRequired,
  indicators: INDICATORS_ARRAY_SHAPE,
  onBacktestStart: PropTypes.func.isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
  openNewTest: PropTypes.func.isRequired,
}

BacktestTab.defaultProps = {
  indicators: [],
}

export default BacktestTab
