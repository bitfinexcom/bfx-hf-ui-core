import React, { useState, useEffect, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import ProgressBar from '../../ui/ProgressBar'

import './style.css'

const ipcHelpers = window.electronService

const UPDATE_STATES = {
  UPDATE_AVAILABLE: 'UPDATE_AVAILABLE',
  UPDATE_DOWNLOADING: 'UPDATE_DOWNLOADING',
  UPDATE_DOWNLOADED: 'UPDATE_DOWNLOADED',
  UPDATE_INSTALLED: 'UPDATE_INSTALLED',
  UPDATE_ERROR: 'UPDATE_ERROR',
}

const LOCAL_STORAGE_KEY_SHOW_NEW_VERSION = 'HF_SHOW_NEW_VERSION'

const AppUpdateBar = () => {
  const { t } = useTranslation()

  const [isShown, setIsShown] = useState(false)
  const [newVersion, setNewVersion] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [updatingState, setUpdatingState] = useState(null)

  const closeNotification = () => {
    setIsShown(false)
    ipcHelpers?.sendClearAppUpdateTimerEvent()
  }

  const onUpdateAvailable = (_, args) => {
    setNewVersion(args?.version)
    setUpdatingState(UPDATE_STATES.UPDATE_AVAILABLE)
    setIsShown(true)
  }

  const onUpdateDownloading = (_, args) => {
    setDownloadProgress(Math.round(args?.percent))
  }

  const onUpdateDownloaded = (_, { version }) => {
    // Close download, and show success message
    // Then restart the application after 3s
    setIsShown(false)
    setTimeout(() => {
      setUpdatingState(UPDATE_STATES.UPDATE_DOWNLOADED)
      setIsShown(true)

      setTimeout(() => {
        if (version) {
          localStorage.setItem(LOCAL_STORAGE_KEY_SHOW_NEW_VERSION, version)
        }
        ipcHelpers?.sendRestartAppEvent()
      }, 3000)
    }, 1000)
  }

  const onUpdateError = () => {
    setUpdatingState(UPDATE_STATES.UPDATE_ERROR)
    setIsShown(true)
    setTimeout(closeNotification, 3000)
  }

  const onDownloadAndRestartButtonClick = () => {
    // Close update request and open download
    setIsShown(false)
    ipcHelpers?.sendDownloadUpdateEvent()

    setTimeout(() => {
      setUpdatingState(UPDATE_STATES.UPDATE_DOWNLOADING)
      setIsShown(true)
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
  }, [downloadProgress, newVersion, t, updatingState])

  useEffect(() => {
    const updatedToNewVersion = localStorage.getItem(LOCAL_STORAGE_KEY_SHOW_NEW_VERSION)
    if (updatedToNewVersion) {
      // Show a message about the successful installation of the new version
      setTimeout(() => {
        setNewVersion(updatedToNewVersion)
        setUpdatingState(UPDATE_STATES.UPDATE_INSTALLED)
        setIsShown(true)
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
      in={isShown}
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
