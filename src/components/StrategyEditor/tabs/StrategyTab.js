import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import StrategyPerfomanceMetrics from '../../StrategyPerfomanceMetrics'
import { results as mockResults } from '../../../pages/Strategies/mock_data'
import StrategyTradesTable from '../../StrategyTradesTable'
import StrategiesGridLayout from '../components/StrategiesGridLayout'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
} from './StrategyTab.constants'
import StrategyLiveChart from '../../StrategyLiveChart'
import StrategyOptionsPanel from '../../StrategyOptionsPanel'

const StrategyTab = (props) => {
  const {
    trades, results = mockResults,
  } = props
  const [layoutConfig, setLayoutConfig] = useState(LAYOUT_CONFIG)
  const [fullscreenChart, setFullScreenChart] = useState(false)

  const optionsCollapse = () => {
    setLayoutConfig(LAYOUT_CONFIG)
  }

  const renderGridComponents = useCallback(
    (i) => {
      switch (i) {
        case COMPONENTS_KEYS.OPTIONS:
          return (
            <StrategyOptionsPanel {...props} onСollapse={optionsCollapse} setFullScreenChart={() => setFullScreenChart(true)} />
          )

        case COMPONENTS_KEYS.LIVE_CHART:
          return <StrategyLiveChart {...props} fullscreenChart={fullscreenChart} exitFullscreenChart={() => setFullScreenChart(false)} />

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

        default:
          return null
      }
    },
    [layoutConfig, props, fullscreenChart],
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

StrategyTab.propTypes = {
  trades: PropTypes.bool.isRequired,
}

export default StrategyTab
