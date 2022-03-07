import React, { useState, useEffect } from 'react'
import cx from 'clsx'
import { isElectronApp } from '../../redux/config'

import './style.css'

const ipcHelpers = window.electronService

// @TODO: i18n
function AppUpdate() {
  const [hideNotification, setHideNotification] = useState(true)
  const [hideRestart, setHideRestart] = useState(true)
  const [message, setMessage] = useState('')

  const onUpdateAvailable = () => {
    setMessage('A new update is available. Downloading now...')
    setHideNotification(false)
  }

  // eslint-disable-next-line
  const onUpdateDownloaded = (_event, releaseNotes, releaseName) => {
    setMessage('Update Downloaded. It will be installed on restart. Restart now?')
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
      <p className='message'>{message}</p>
      <div className='btn-group'>
        <button
          className='close-button'
          type='button'
          onClick={closeNotification}
        >
          Close
        </button>
        <button
          className={cx('restart', {
            hidden: hideRestart,
          })}
          type='button'
          onClick={restartApp}
        >
          Restart
        </button>
      </div>
    </div>
  )
}

AppUpdate.propTypes = { }

export default AppUpdate
