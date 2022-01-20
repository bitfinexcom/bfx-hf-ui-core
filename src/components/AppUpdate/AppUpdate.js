import React, { useState, useEffect } from 'react'
import cx from 'clsx'
import _isFunction from 'lodash/isFunction'
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
    if (_isFunction(window.require) && isElectronApp) {
      const electron = window.require('electron')
      const { ipcRenderer } = electron

      ipcRenderer.on('update_available', onUpdateAvailable)
      ipcRenderer.on('update_downloaded', onUpdateDownloaded)

      return () => {
        ipcRenderer.removeListener('update_available', onUpdateAvailable)
        ipcRenderer.removeListener('update_downloaded', onUpdateDownloaded)
      }
    }

    return () => {} // consistent-return
  }, [])

  const closeNotification = () => {
    setHideNotification(true)
    if (_isFunction(window.require)) {
      const electron = window.require('electron')
      const { ipcRenderer } = electron
      ipcRenderer.send('clear_app_update_timer')
    }
  }

  const restartApp = () => {
    if (_isFunction(window.require)) {
      const electron = window.require('electron')
      const { ipcRenderer } = electron
      ipcRenderer.send('restart_app')
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
