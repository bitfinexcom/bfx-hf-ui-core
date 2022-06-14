import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import StrategyPerfomanceMetrics from '../../StrategyPerfomanceMetrics'
import BacktestTradesTable from '../../StrategyTradesTable'
import StrategiesGridLayout from '../components/StrategiesGridLayout'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
  LAYOUT_CONFIG_NO_DATA,
  LAYOUT_CONFIG_WITHOUT_TRADES,
} from '../components/StrategiesGridLayout.constants'
import StrategyLiveChart from '../../StrategyLiveChart'
import BacktestOptionsPanel from '../../BacktestOptionsPanel'

const BacktestTab = (props) => {
  const { results, onCancelProcess, strategy } = props
  const { t } = useTranslation()
  const [layoutConfig, setLayoutConfig] = useState()
  const [fullscreenChart, setFullScreenChart] = useState(false)

  const { finished = false, loading, trades } = results
  const positions = results?.strategy?.closedPositions

  useEffect(() => {
    if (!finished) {
      setLayoutConfig(LAYOUT_CONFIG_NO_DATA)
      return
    }
    if (_isEmpty(trades)) {
      setLayoutConfig(LAYOUT_CONFIG_WITHOUT_TRADES)
      return
    }
    setLayoutConfig(LAYOUT_CONFIG)
  }, [finished, trades])

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
    [layoutConfig, props, fullscreenChart, finished, loading, results, strategy, positions],
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
    trades: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line
    strategy: PropTypes.object, // eslint-disable-line
  }).isRequired,
  onCancelProcess: PropTypes.func.isRequired,
  strategy: PropTypes.object.isRequired, // eslint-disable-line
}

export default BacktestTab
