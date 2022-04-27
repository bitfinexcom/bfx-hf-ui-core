import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import StrategyPerfomanceMetrics from '../../StrategyPerfomanceMetrics'
import StrategyTradesTable from '../../StrategyTradesTable'
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
  const { results } = props
  const { t } = useTranslation()
  const [layoutConfig, setLayoutConfig] = useState()
  const [fullscreenChart, setFullScreenChart] = useState(false)

  const optionsCollapse = () => {
    setLayoutConfig(LAYOUT_CONFIG)
  }

  const { finished, loading, trades } = results

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
              onСollapse={optionsCollapse}
              setFullScreenChart={() => setFullScreenChart(true)}
              isBacktestLoading={loading}
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
          return <StrategyPerfomanceMetrics results={results} isLoading={loading} />

        case COMPONENTS_KEYS.STRATEGY_TRADES:
          return (
            <StrategyTradesTable
              results={results}
              setLayoutConfig={setLayoutConfig}
              layoutConfig={layoutConfig}
              onTradeClick={() => {}}
            />
          )

        default:
          return null
      }
    },
    [layoutConfig, props, fullscreenChart, finished, loading, results],
  )

  return (
    <div className='hfui-strategyeditor__wrapper'>
      <StrategiesGridLayout
        layoutConfig={layoutConfig}
        renderGridComponents={renderGridComponents}
        isLoading={loading}
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
  trades: PropTypes.bool.isRequired,
  results: PropTypes.shape({
    finished: PropTypes.bool,
    loading: PropTypes.bool,
    trades: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
}

export default BacktestTab
