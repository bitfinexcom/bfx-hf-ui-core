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
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
  LAYOUT_CONFIG_NO_DATA,
} from '../components/StrategiesGridLayout.constants'
import StrategyLiveChart from '../../StrategyLiveChart'
import BacktestOptionsPanel from '../../BacktestOptionsPanel'
import { prepareChartTrades } from '../StrategyEditor.helpers'
import { INDICATORS_ARRAY_SHAPE, MARKET_SHAPE, STRATEGY_SHAPE } from '../../../constants/prop-types-shapes'

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
  const [layoutConfig, setLayoutConfig] = useState()
  const [fullscreenChart, , showFullscreenChart, hideFullscreenChart] = useToggle(false)

  const { finished = false, loading } = results
  const positions = results?.strategy?.closedPositions

  const trades = useMemo(() => prepareChartTrades(positions), [positions])

  useEffect(() => {
    if (!finished) {
      setLayoutConfig(LAYOUT_CONFIG_NO_DATA)
      return
    }
    setLayoutConfig(LAYOUT_CONFIG)
  }, [finished])

  const renderGridComponents = useCallback(
    (i) => {
      switch (i) {
        case COMPONENTS_KEYS.OPTIONS:
          return (
            <BacktestOptionsPanel
              strategy={strategy}
              onBacktestStart={onBacktestStart}
              saveStrategyOptions={saveStrategyOptions}
              setFullScreenChart={showFullscreenChart}
              isFinished={finished}
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
    [strategy, onBacktestStart, saveStrategyOptions, showFullscreenChart, finished, indicators, markets, fullscreenChart, hideFullscreenChart, trades, results, loading, positions, layoutConfig],
  )

  return (
    <div className='hfui-strategyeditor__wrapper'>
      <StrategiesGridLayout
        layoutConfig={layoutConfig}
        renderGridComponents={renderGridComponents}
        isLoading={loading}
        onCancelProcess={onCancelProcess}
      />
      {!finished && !loading && (
        <p className='hfui-strategyeditor__initial-message'>
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
  markets: PropTypes.objectOf(PropTypes.shape(MARKET_SHAPE)).isRequired,
  indicators: INDICATORS_ARRAY_SHAPE,
  onBacktestStart: PropTypes.func.isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
}

BacktestTab.defaultProps = {
  indicators: [],
}

export default BacktestTab
