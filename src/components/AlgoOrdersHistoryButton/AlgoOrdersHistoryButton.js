import React, { useRef, useEffect } from 'react'
import Icon from 'react-fa'
import _toUpper from 'lodash/toUpper'
import { useDispatch, useSelector } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { Spinner } from '@ufx-ui/core'
import PanelButton from '../../ui/Panel/Panel.Button'
import { getShowAOsHistory } from '../../redux/selectors/ao'
import { getIsAOsHistoryLoaded } from '../../redux/selectors/ws'
import AOActions from '../../redux/actions/ao'
import useToggle from '../../hooks/useToggle'

import './style.css'

const AlgoOrdersHistoryButton = () => {
  const [isHistoryLoading, , setIsLoading, setStopLoading] = useToggle(false)
  const timeoutId = useRef(null)

  const { t } = useTranslation()

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
    <PanelButton
      onClick={onButtonClickHandler}
      text={_toUpper(t('tradingStatePanel.history'))}
      isActive={isHistoryActive}
      icon={
        isHistoryLoading ? (
          <Spinner className='hfui-history-button__spinner' />
        ) : (
          <Icon name='history' className='hfui-history-button__icon' />
        )
      }
    />
  )
}

export default AlgoOrdersHistoryButton
