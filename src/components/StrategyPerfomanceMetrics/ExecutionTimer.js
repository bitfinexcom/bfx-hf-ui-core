import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useStopwatch } from 'react-timer-hook'
import { pad2 } from '@ufx-ui/utils'

const ExecutionTimer = ({
  startedOn, isExecuting, isPaused, delay,
}) => {
  const { t } = useTranslation()

  const stopWatchParams = useMemo(() => {
    const stopwatchOffset = new Date()
    stopwatchOffset.setMilliseconds(
      stopwatchOffset.getMilliseconds() + (Date.now() - startedOn - delay),
    )

    return {
      offsetTimestamp: stopwatchOffset,
    }
  }, [startedOn, delay])

  const {
    days, hours, minutes, seconds, pause, isRunning, start,
  } = useStopwatch(stopWatchParams)

  useEffect(() => {
    if (!isPaused && isExecuting && !isRunning) {
      start()
    }
    if (isPaused || (!isExecuting && isRunning)) {
      pause()
    }
  }, [isExecuting, isRunning, isPaused, pause, start])

  const runnedForValue = `${days}:${pad2(hours)}:${pad2(minutes)}:${pad2(
    seconds,
  )}`

  return (
    <li className='hfui-performance-metrics__runnedFor'>
      <p>{t('strategyEditor.perfomanceMetrics.runTime')}</p>
      <p>{runnedForValue}</p>
    </li>
  )
}

ExecutionTimer.propTypes = {
  isExecuting: PropTypes.bool.isRequired,
  startedOn: PropTypes.number.isRequired,
  isPaused: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
}

export default ExecutionTimer
