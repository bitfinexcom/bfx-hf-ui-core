import React, { useState } from 'react'
import { Icon } from 'react-fa'
import Panel from '../../ui/Panel'
import StrategyParams from './StrategiesMenuSideBar.Params'

const StrategiesMenuSideBar = ({ startExecution, stopExecution }) => {
  const [paramsOpen, setParamsOpen] = useState(true)

  return (
    <Panel
      moveable
      removeable={false}
      // forcedTab={forcedTab}
      // onTabChange={setStrategyTab}
      darkHeader
    >
      <div
        sbtitle={(
          <>
            Strategy
            <StrategyParams
              paramsOpen={paramsOpen}
              setParamsOpen={setParamsOpen}
              startExecution={startExecution}
              stopExecution={stopExecution}
            />
          </>
            )}
        sbicon={<Icon name='file-code-o' />}
      />
      <div
        sbtitle='View in IDE'
        sbicon={<Icon name='edit' />}
      />
      <div
        sbtitle='Help'
        sbicon={<Icon name='question-circle-o' />}
      />
    </Panel>
  )
}

export default StrategiesMenuSideBar
