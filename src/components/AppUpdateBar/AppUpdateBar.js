import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { useTranslation } from 'react-i18next'

import ProgressBar from '../../ui/ProgressBar'
import { logInformation } from '../../redux/actions/ui'
import { LOG_LEVELS } from '../../constants/logging'
import './style.css'

const ipcHelpers = window.electronService

const UPDATE_STATES = {
  UPDATE_AVAILABLE: 'UPDATE_AVAILABLE',
  UPDATE_DOWNLOADING: 'UPDATE_DOWNLOADING',
  UPDATE_DOWNLOADED: 'UPDATE_DOWNLOADED',
  UPDATE_INSTALLED: 'UPDATE_INSTALLED',
  UPDATE_ERROR: 'UPDATE_ERROR',
}

const UPDATE_AVAILABLE_MSG = 'New Honey version has been detected.'
const UPDATE_DOWNLOADED_MSG = 'New Honey version has been downloaded.'
const UPDATE_DOWNLOAD_ERROR_MSG = 'An error occured while downloading new Honey version.'
const UPDATE_DOWNLOAD_INITIATED_MSG = 'Initiated download of a new Honey version.'
const UPDATE_INSTALLED_MSG = 'New Honey version has been installed.'

const LOCAL_STORAGE_KEY_SHOW_NEW_VERSION = 'HF_SHOW_NEW_VERSION'

const AppUpdateBar = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [newVersion, setNewVersion] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [updatingState, setUpdatingState] = useState(null)

  const closeNotification = () => {
    setIsOpen(false)
    ipcHelpers?.sendClearAppUpdateTimerEvent()
  }

  const _setUpdatingState = (state, meta) => {
    setUpdatingState(state)

    switch (state) {
      case UPDATE_STATES.UPDATE_AVAILABLE: {
        const { version } = meta
        dispatch(logInformation(UPDATE_AVAILABLE_MSG, LOG_LEVELS.INFO, 'update_detected', { version }))
        break
      }

      case UPDATE_STATES.UPDATE_DOWNLOADING: {
        dispatch(logInformation(UPDATE_DOWNLOAD_INITIATED_MSG, LOG_LEVELS.INFO, 'update_download_initiated'))
        break
      }

      case UPDATE_STATES.UPDATE_DOWNLOADED: {
        const { version } = meta
        dispatch(logInformation(UPDATE_DOWNLOADED_MSG, LOG_LEVELS.INFO, 'update_download_success', { version }))
        break
      }

      case UPDATE_STATES.UPDATE_ERROR: {
        dispatch(logInformation(UPDATE_DOWNLOAD_ERROR_MSG, LOG_LEVELS.WARN, 'update_download_failed', meta))
        break
      }

      case UPDATE_STATES.UPDATE_INSTALLED: {
        dispatch(logInformation(UPDATE_INSTALLED_MSG, LOG_LEVELS.INFO, 'update_install_success'))
        break
      }

      default:
        break
    }
  }

  const onUpdateAvailable = (_, args) => {
    setNewVersion(args?.version)
    _setUpdatingState(UPDATE_STATES.UPDATE_AVAILABLE, {
      version: args?.version,
    })
    setIsOpen(true)
  }

  const onUpdateDownloading = (_, args) => {
    setDownloadProgress(Math.round(args?.percent))
  }

  const onUpdateDownloaded = (_, { version }) => {
    // Close download, and show success message
    // Then restart the application after 3s
    setIsOpen(false)
    setTimeout(() => {
      _setUpdatingState(UPDATE_STATES.UPDATE_DOWNLOADED, { version })
      setIsOpen(true)

      setTimeout(() => {
        if (version) {
          localStorage.setItem(LOCAL_STORAGE_KEY_SHOW_NEW_VERSION, version)
        }
        ipcHelpers?.sendRestartAppEvent()
      }, 3000)
    }, 1000)
  }

  const onUpdateError = () => {
    _setUpdatingState(UPDATE_STATES.UPDATE_ERROR)
    setIsOpen(true)
    setTimeout(closeNotification, 3000)
  }

  const onDownloadAndRestartButtonClick = () => {
    // Close update request and open download
    setIsOpen(false)
    ipcHelpers?.sendDownloadUpdateEvent()

    setTimeout(() => {
      _setUpdatingState(UPDATE_STATES.UPDATE_DOWNLOADING)
      setIsOpen(true)
    }, 1000)
  }

  const renderBarContent = useCallback(() => {
    switch (updatingState) {
      case UPDATE_STATES.UPDATE_AVAILABLE: {
        return (
          <div>
            <p className='message'>
              {t('appUpdate.available', { version: newVersion })}
            </p>
            <div className='btn-group'>
              <button
                className='close-button'
                type='button'
                onClick={onDownloadAndRestartButtonClick}
              >
                {t('appUpdate.downloadButton')}
              </button>
              <button
                className='close-button'
                type='button'
                onClick={closeNotification}
              >
                {t('appUpdate.remindMeButton')}
              </button>
            </div>
          </div>
        )
      }

      case UPDATE_STATES.UPDATE_DOWNLOADING: {
        return (
          <div>
            <p className='message'>
              {downloadProgress
                ? t('appUpdate.downloading')
                : t('appUpdate.preparing')}
            </p>
            <ProgressBar percent={downloadProgress} showPercent />
          </div>
        )
      }

      case UPDATE_STATES.UPDATE_DOWNLOADED: {
        return (
          <div>
            <p className='message'>{t('appUpdate.downloaded')}</p>
          </div>
        )
      }

      case UPDATE_STATES.UPDATE_INSTALLED: {
        return (
          <div>
            <p className='message'>
              {t('appUpdate.updateInstalled', { version: newVersion })}
            </p>
          </div>
        )
      }

      case UPDATE_STATES.UPDATE_ERROR: {
        return (
          <div>
            <p className='message'>{t('appUpdate.updateError')}</p>
          </div>
        )
      }
      default:
        return null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadProgress, newVersion, t, updatingState])

  useEffect(() => {
    const updatedToNewVersion = localStorage.getItem(LOCAL_STORAGE_KEY_SHOW_NEW_VERSION)
    if (updatedToNewVersion) {
      // Show a message about the successful installation of the new version
      setTimeout(() => {
        setNewVersion(updatedToNewVersion)
        _setUpdatingState(UPDATE_STATES.UPDATE_INSTALLED)
        setIsOpen(true)
        localStorage.removeItem(LOCAL_STORAGE_KEY_SHOW_NEW_VERSION)
        setTimeout(closeNotification, 3000)
      }, 1000)
    }

    if (ipcHelpers) {
      ipcHelpers.addAppUpdateAvailableEventListener(onUpdateAvailable)
      ipcHelpers.addAppUpdateDownloadProgressListener(onUpdateDownloading)
      ipcHelpers.addAppUpdateDownloadedEventListener(onUpdateDownloaded)
      ipcHelpers.addAppUpdateErrorListener(onUpdateError)

      return () => {
        ipcHelpers.removeAllAppUpdateEventListeners()
      }
    }

    return () => {} // consistent-return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CSSTransition
      in={isOpen}
      timeout={600}
      classNames='hfui-app-update__notification__transition'
      appear
      unmountOnExit
    >
      <div className='hfui-app-update__notification'>{renderBarContent()}</div>
    </CSSTransition>
  )
}

export default AppUpdateBar
