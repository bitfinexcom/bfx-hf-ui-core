import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import StrategyPerfomanceMetrics from '../../StrategyPerfomanceMetrics'
import StrategyTradesTable from '../../StrategyTradesTable'
import StrategiesGridLayout from '../components/StrategiesGridLayout'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
  LAYOUT_CONFIG_NO_DATA,
} from './BacktestTab.constants'
import StrategyLiveChart from '../../StrategyLiveChart'
import StrategyOptionsPanel from '../../StrategyOptionsPanel'
import BacktestOptionsPanel from '../../BacktestOptionsPanel'

const BacktestTab = (props) => {
  const { results } = props
  const { t } = useTranslation()
  const [layoutConfig, setLayoutConfig] = useState()
  const [fullscreenChart, setFullScreenChart] = useState(false)

  const optionsCollapse = () => {
    setLayoutConfig(LAYOUT_CONFIG)
  }

  const { finished, loading } = results

  useEffect(() => {
    if (!finished) {
      setLayoutConfig(LAYOUT_CONFIG_NO_DATA)
    } else {
      setLayoutConfig(LAYOUT_CONFIG)
    }
  }, [finished])

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
          return <StrategyPerfomanceMetrics results={results} />

        case COMPONENTS_KEYS.STRATEGY_TRADES:
          return (
            <StrategyTradesTable
              results={results}
              setLayoutConfig={setLayoutConfig}
              layoutConfig={layoutConfig}
              onTradeClick={() => {}}
            />
          )

        case COMPONENTS_KEYS.DESCRIPTION:
          return (
            <div className='hfui-strategyeditor__wrapper'>
              {loading
                ? t('strategyEditor.backtestingLoadingMessage')
                : t('strategyEditor.backtestingStartingMessage')}
            </div>
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
      />
    </div>
  )
}

BacktestTab.propTypes = {
  trades: PropTypes.bool.isRequired,
  results: PropTypes.shape({
    finished: PropTypes.bool,
    loading: PropTypes.bool,
  }).isRequired,
}

export default BacktestTab
