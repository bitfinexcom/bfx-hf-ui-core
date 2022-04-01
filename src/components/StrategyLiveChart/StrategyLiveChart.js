import React from 'react'
import { useSelector } from 'react-redux'
import { getActiveMarket, getThemeSetting } from '../../redux/selectors/ui'
import Panel from '../../ui/Panel'
import Chart from '../Chart'

// PLUG
const StrategyLiveChart = () => {
  const settingsTheme = useSelector(getThemeSetting)
  const currentMarket = useSelector(getActiveMarket)

  return (
    <Panel
      darkHeader
      removeable={false}
      moveable={false}
      className='hfui-chart__wrapper'
    >
      <Chart market={currentMarket} theme={settingsTheme} />
    </Panel>
  )
}

export default StrategyLiveChart
