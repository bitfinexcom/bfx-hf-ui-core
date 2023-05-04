import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { Button, Intent } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import WSActions from '../../redux/actions/ws'
import { getUIState, SETTINGS_KEYS } from '../../redux/selectors/ui'
import useToggle from '../../hooks/useToggle'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import UIActions from '../../redux/actions/ui'
import { isMacOS } from '../../redux/config'

import './style.css'

const ipcHelpers = window.electronService

const FullscreenModeBar = () => {
  const [isShown, , showBar, hideBar] = useToggle(false)
  const shouldBarBeShown = useSelector((state) => getUIState(state, UI_KEYS.isFullscreenBarShown))

  const timeoutRef = useRef(null)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onClose = () => {
    hideBar()
    dispatch(UIActions.setUIValue(UI_KEYS.isFullscreenBarShown, false))
  }

  const onExitFullscreen = () => {
    dispatch(WSActions.saveSetting(SETTINGS_KEYS.FULLSCREEN, false))
    if (ipcHelpers) {
      ipcHelpers.sendChangeFullscreenEvent(false)
    }
    onClose()
  }

  const onComponentEntered = () => {
    timeoutRef.current = setTimeout(onClose, 5000)
  }

  useEffect(() => {
    if (shouldBarBeShown) {
      showBar()
    } else if (isShown) {
      onClose()
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldBarBeShown])

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
          onClick={onClose}
        >
          &#10005;
        </button>
        <p className='hfui-fullscreen-mode-bar__text'>
          {t('appSettings.fullscreenModeBarText')}
        </p>
        <Button intent={Intent.INFO} onClick={onExitFullscreen} small>
          {t('appSettings.exitFullscreenButton', {
            key: isMacOS ? '⌘+F11' : 'F11',
          })}
        </Button>
      </div>
    </CSSTransition>
  )
}

export default FullscreenModeBar
