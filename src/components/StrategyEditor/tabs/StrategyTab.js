import React, { useCallback, useState, memo } from 'react'
import PropTypes from 'prop-types'

import StrategyPerfomanceMetrics from '../../StrategyPerfomanceMetrics'
import { results } from '../../../pages/Strategies/mock_data'
import timeFrames from '../../../util/time_frames'
import StrategyTradesTable from '../../StrategyTradesTable'
import StrategiesGridLayout from '../components/StrategiesGridLayout'
import { COMPONENTS_KEYS, LAYOUT_CONFIG } from './StrategyTab.constants'
import StrategyLiveChart from '../../StrategyLiveChart'
import StrategyOptionsPanel from '../../StrategyOptionsPanel'

const StrategyTab = (props) => {
  const [layoutConfig, setLayoutConfig] = useState(LAYOUT_CONFIG)

  const renderGridComponents = useCallback((i) => {
    console.log('grid callback')
    switch (i) {
      case COMPONENTS_KEYS.OPTIONS:
        return <StrategyOptionsPanel />

      case COMPONENTS_KEYS.LIVE_CHART:
        return <StrategyLiveChart {...props} />

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
  }, [layoutConfig, props])

  return (
    <div className='hfui-strategyeditor__wrapper'>
      <StrategiesGridLayout
        layoutConfig={layoutConfig}
        renderGridComponents={renderGridComponents}
      />
    </div>
  )
}

export default memo(StrategyTab)
