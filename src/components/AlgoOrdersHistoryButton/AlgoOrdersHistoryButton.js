import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getShowAOsHistory } from '../../redux/selectors/ao'
import { getIsAOsHistoryLoaded } from '../../redux/selectors/ws'
import AOActions from '../../redux/actions/ao'
import useToggle from '../../hooks/useToggle'
import HistoryButton from '../../ui/HistoryButton'

const AlgoOrdersHistoryButton = () => {
  const [isHistoryLoading, , setIsLoading, setStopLoading] = useToggle(false)
  const timeoutId = useRef(null)

  const isHistoryActive = useSelector(getShowAOsHistory)
  const isHistoryLoaded = useSelector(getIsAOsHistoryLoaded)

  const dispatch = useDispatch()
  const onButtonClickHandler = () => {
    if (isHistoryLoading) {
      return
    }

    if (!isHistoryActive && !isHistoryLoaded) {
      // Show a spinner if the history mode was selected and the history is going to be loaded
      setIsLoading()
    }

    dispatch(AOActions.setShowAOsHistory(!isHistoryActive))
  }

  useEffect(() => {
    if (isHistoryLoading) {
      timeoutId.current = setTimeout(() => {
        // The history mode and the spinner turn off, if something went wrong, and the history wasn't loaded
        setStopLoading()
        dispatch(AOActions.setShowAOsHistory(false))
      }, 5000)
    }
  }, [isHistoryLoading, setStopLoading, dispatch])

  useEffect(() => {
    if (isHistoryLoaded && isHistoryLoading) {
      setStopLoading()
      clearTimeout(timeoutId.current)
    }
  }, [isHistoryLoaded, isHistoryLoading, setStopLoading])

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  return (
    <HistoryButton
      onClick={onButtonClickHandler}
      isActive={isHistoryActive}
      isLoading={isHistoryLoading}
    />
  )
}

export default AlgoOrdersHistoryButton
