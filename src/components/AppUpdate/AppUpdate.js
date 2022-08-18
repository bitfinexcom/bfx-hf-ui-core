import React, { useState, useEffect } from 'react'
import cx from 'clsx'
import { useTranslation } from 'react-i18next'
import { isElectronApp } from '../../redux/config'
import './style.css'

const ipcHelpers = window.electronService

const UPDATE_STATES = {
  UPDATE_AVAILABLE: 'UPDATE_AVAILABLE',
  UPDATE_DOWNLOADED: 'UPDATE_DOWNLOADED',
}

const AppUpdate = () => {
  const { t } = useTranslation()

  const [hideNotification, setHideNotification] = useState(true)
  const [hideRestart, setHideRestart] = useState(true)
  const [updateState, setUpdateState] = useState(null)

  const onUpdateAvailable = () => {
    setUpdateState(UPDATE_STATES.UPDATE_AVAILABLE)
    setHideNotification(false)
  }

  // eslint-disable-next-line
  const onUpdateDownloaded = (_event, releaseNotes, releaseName) => {
    setUpdateState(UPDATE_STATES.UPDATE_DOWNLOADED)
    setHideRestart(false)
    setHideNotification(false)
  }

  useEffect(() => {
    if (ipcHelpers && isElectronApp) {
      ipcHelpers.addAppUpdateAvailableEventListener(onUpdateAvailable)
      ipcHelpers.addAppUpdateDownloadedEventListener(onUpdateDownloaded)

      return () => {
        ipcHelpers.removeAppUpdateAvailableEventListener(onUpdateAvailable)
        ipcHelpers.removeAppUpdateDownloadedEventListener(onUpdateDownloaded)
      }
    }

    return () => {} // consistent-return
  }, [])

  const closeNotification = () => {
    setHideNotification(true)
    if (ipcHelpers) {
      ipcHelpers.sendClearAppUpdateTimerEvent()
    }
  }

  const restartApp = () => {
    if (ipcHelpers) {
      ipcHelpers.sendRestartAppEvent()
    }
  }

  return (
    <div
      className={cx('hfui-app-update__notification', { hidden: hideNotification })}
    >
      <p className='message'>
        {updateState === UPDATE_STATES.UPDATE_AVAILABLE && t('appUpdate.available')}
        {updateState === UPDATE_STATES.UPDATE_DOWNLOADED && t('appUpdate.downloaded')}
      </p>
      <div className='btn-group'>
        <button
          className='close-button'
          type='button'
          onClick={closeNotification}
        >
          {t('ui.closeBtn')}
        </button>
        <button
          className={cx('restart', {
            hidden: hideRestart,
          })}
          type='button'
          onClick={restartApp}
        >
          {t('ui.restartBtn')}
        </button>
      </div>
    </div>
  )
}

export default AppUpdate
