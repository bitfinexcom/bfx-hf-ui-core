import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import StrategyPerfomanceMetrics from '../../StrategyPerfomanceMetrics'
import BacktestTradesTable from '../../StrategyTradesTable'
import StrategiesGridLayout from '../components/StrategiesGridLayout'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
  LAYOUT_CONFIG_NO_DATA,
} from '../components/StrategiesGridLayout.constants'
import StrategyLiveChart from '../../StrategyLiveChart'
import BacktestOptionsPanel from '../../BacktestOptionsPanel'
import { prepareChartTrades } from '../StrategyEditor.helpers'

const BacktestTab = (props) => {
  const { results, onCancelProcess, strategy } = props
  const { t } = useTranslation()
  const [layoutConfig, setLayoutConfig] = useState()
  const [fullscreenChart, setFullScreenChart] = useState(false)

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
              {...props}
              setFullScreenChart={() => setFullScreenChart(true)}
              isFinished={finished}
            />
          )

        case COMPONENTS_KEYS.LIVE_CHART:
          return (
            <StrategyLiveChart
              {...props}
              fullscreenChart={fullscreenChart}
              exitFullscreenChart={() => setFullScreenChart(false)}
              trades={trades}
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
            <BacktestTradesTable
              results={positions}
              setLayoutConfig={setLayoutConfig}
              layoutConfig={layoutConfig}
              onTradeClick={() => {}}
              strategy={strategy}
            />
          )

        default:
          return null
      }
    },
    [props, finished, fullscreenChart, trades, results, loading, positions, layoutConfig, strategy],
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
    strategy: PropTypes.object, // eslint-disable-line
  }).isRequired,
  onCancelProcess: PropTypes.func.isRequired,
  strategy: PropTypes.object.isRequired, // eslint-disable-line
}

export default BacktestTab
