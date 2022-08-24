import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { Button, Intent } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import WSActions from '../../redux/actions/ws'
import { getIsFullscreen, SETTINGS_KEYS } from '../../redux/selectors/ui'
import useToggle from '../../hooks/useToggle'

import './style.css'

const ipcHelpers = window.electronService

const FullscreenModeBar = () => {
  const [isShown, , showBar, hideBar] = useToggle(false)

  const timeoutRef = useRef(null)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const isFullscreen = useSelector(getIsFullscreen)

  const onExitFullscreen = () => {
    dispatch(WSActions.saveSettings(SETTINGS_KEYS.FULLSCREEN, false))
    if (ipcHelpers) {
      ipcHelpers.sendChangeFullscreenEvent(false)
    }
  }

  const onComponentEntered = () => {
    timeoutRef.current = setTimeout(hideBar, 5000)
  }

  useEffect(() => {
    if (isFullscreen) {
      showBar()
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isFullscreen, showBar])

  return (
    <CSSTransition
      in={isShown}
      timeout={600}
      classNames='hfui-fullscreen-mode-bar__transition'
      onEntered={onComponentEntered}
      appear
      unmountOnExit
    >
      <div className='hfui-fullscreen-mode-bar'>
        <button
          type='button'
          className='hfui-fullscreen-mode-bar__close-button'
          onClick={hideBar}
        >
          &#10005;
        </button>
        <p className='hfui-fullscreen-mode-bar__text'>
          {t('appSettings.fullscreenModeBarText')}
        </p>
        <Button intent={Intent.INFO} onClick={onExitFullscreen} small>
          {t('appSettings.exitFullscreenButton')}
        </Button>
      </div>
    </CSSTransition>
  )
}

export default FullscreenModeBar
