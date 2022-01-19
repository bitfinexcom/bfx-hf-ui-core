import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import _isFunction from 'lodash/isFunction'
import Debug from 'debug'
import { isElectronApp } from '../../redux/config'

import './style.css'

// TODO: i18n
function AppUpdate() {
  const [hideNotification, setHideNotification] = useState(true)
  const [hideRestart, setHideRestart] = useState(true)
  const [message, setMessage] = useState('')

  // init state
  useEffect(() => {
    setHideNotification(true)
    setHideRestart(true)
    setMessage('')
  }, [])

  const onUpdateAvailable = () => {
    setMessage('A new update is available. Downloading now...')
    setHideNotification(false)
  }

  const onUpdateDownloaded = (notes, name) => {
    setMessage(notes || name || 'Update Downloaded. It will be installed on restart. Restart now?')
    setHideRestart(false)
    setHideNotification(false)
  }

  useEffect(() => {
    // if running in the electron environment
    if (_isFunction(window.require) && isElectronApp) {
      const electron = window.require('electron')
      const { ipcRenderer } = electron

      const _onUpdateAvailable = () => {
        Debug('_onUpdateAvailable: _onUpdateAvailable:_onUpdateAvailable:_onUpdateAvailable: ')
        // ipcRenderer.removeAllListeners('update_available')
        onUpdateAvailable()
      }
      const _onUpdateDownloaded = (event, releaseNotes, releaseName) => {
        Debug('releaseName: ', releaseName)
        Debug('releaseNotes: ', releaseNotes)
        Debug('_onUpdateDownloaded: _onUpdateDownloaded: _onUpdateDownloaded: ', _onUpdateAvailable)
        // ipcRenderer.removeAllListeners('update_downloaded')
        onUpdateDownloaded(releaseNotes, releaseName)
      }

      ipcRenderer.on('update_available', _onUpdateAvailable)
      ipcRenderer.on('update_downloaded', _onUpdateDownloaded)

      return () => {
        ipcRenderer.removeListener('update_available', _onUpdateAvailable)
        ipcRenderer.removeListener('update_downloaded', _onUpdateDownloaded)
      }
    }

    return () => {} // consistent-return
  }, [])

  const closeNotification = () => {
    setHideNotification(true)
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
