import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import _find from 'lodash/find'

import { getActiveMarket, getThemeSetting } from '../../redux/selectors/ui'
import Panel from '../../ui/Panel'
import Chart from '../Chart'
import { prepareTVIndicators } from './StrategyLiveChart.helpers'
import { TIMEFRAME_INTERVAL_MAPPING } from '../../util/time_frames'

const StrategyLiveChart = ({ opts, results }) => {
  const currentMarket = useSelector(getActiveMarket)
  const settingsTheme = useSelector(getThemeSetting)

  // const { markets, formState, indicators } = opts
  // const { trades = [], backtestOptions: { activeMarket } = {} } = results

  // const [fullScreenChart, setFullScreenChart] = useState(false)

  // const chartIndicators = prepareTVIndicators(indicators)
  // const interval = TIMEFRAME_INTERVAL_MAPPING[formState?.selectedTimeFrame] || '15'

  // const settingsTheme = useSelector(getThemeSetting)
  // const activeMarketObject = _find(
  //   markets,
  //   (market) => market.wsID === activeMarket,
  //   null,
  // )

  return (
    <Panel
      label=''
      removeable={false}
      moveable={false}
      extraIcons={[
        <span
          key='toggle-fullscreen'
          type='button'
          className='icon-move toggle-fullscreen'
          // onClick={() => setFullScreenChart(!fullScreenChart)}
          title='Toggle Fullscreen'
        />,
      ]}
    >
      {/* {activeMarketObject && (
        <Chart
          market={activeMarketObject}
          theme={settingsTheme}
          layoutI='strategy-editor'
          indicators={chartIndicators}
          interval={interval}
          trades={trades}
          hideResolutions
        />
      )} */}
      <Chart market={currentMarket} theme={settingsTheme} />
    </Panel>
  )
}

export default StrategyLiveChart
