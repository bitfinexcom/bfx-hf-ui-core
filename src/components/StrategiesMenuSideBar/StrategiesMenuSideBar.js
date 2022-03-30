import React from 'react'
import { Icon } from 'react-fa'
import Panel from '../../ui/Panel'

const StrategiesMenuSideBar = () => {
  return (
    <Panel
      moveable
      removeable={false}
      // forcedTab={forcedTab}
      // onTabChange={setStrategyTab}
      darkHeader
    >
      <div
        sbtitle='Strategy'
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
