import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { getIsPaperTrading } from '../../../../redux/selectors/ui'
import StrategyLiveTab from './StrategyLiveTab'
import StrategySandboxTab from './StrategySandboxTabSandbox'

const StrategyTabWrapper = (props) => {
  const isPaperTrading = useSelector(getIsPaperTrading)

  return isPaperTrading ? (
    <StrategySandboxTab {...props} />
  ) : (
    <StrategyLiveTab {...props} />
  )
}

export default memo(StrategyTabWrapper)
