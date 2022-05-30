import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { getIsPaperTrading } from '../../../../redux/selectors/ui'
import StrategyLiveChart from '../../../StrategyLiveChart'
import StrategySandboxTab from './StrategySandboxTabSandbox'

const StrategyTabWrapper = (props) => {
  const isPaperTrading = useSelector(getIsPaperTrading)

  return isPaperTrading ? (
    <StrategySandboxTab {...props} />
  ) : (
    <StrategyLiveChart {...props} />
  )
}

export default memo(StrategyTabWrapper)
