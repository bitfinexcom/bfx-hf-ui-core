import React, { useState, useEffect } from 'react'
import cx from 'clsx'
import { isElectronApp } from '../../redux/config'

import './style.css'

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
    if (window.electronAPI && isElectronApp) {
      window.electronAPI.addAppUpdateAvailableEventListener(onUpdateAvailable)
      window.electronAPI.addAppUpdateDownloadedEventListener(onUpdateDownloaded)

      return () => {
        window.electronAPI.removeAppUpdateAvailableEventListener(onUpdateAvailable)
        window.electronAPI.removeAppUpdateDownloadedEventListener(onUpdateDownloaded)
      }
    }

    return () => {} // consistent-return
  }, [])

  const closeNotification = () => {
    setHideNotification(true)
    if (window.electronAPI) {
      window.electronAPI.sendClearAppUpdateTimerEvent()
    }
  }

  const restartApp = () => {
    if (window.electronAPI) {
      window.electronAPI.sendRestartAppEvent()
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
