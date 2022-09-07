import React, { useState, useEffect } from 'react'
import cx from 'clsx'
import { useTranslation } from 'react-i18next'
import ProgressBar from '../../ui/ProgressBar'

import './style.css'
import { CSSTransition } from 'react-transition-group'

const ipcHelpers = window.electronService

const UPDATE_STATES = {
  UPDATE_AVAILABLE: 'UPDATE_AVAILABLE',
  UPDATE_DOWNLOADING: 'UPDATE_DOWNLOADING',
  UPDATE_DOWNLOADED: 'UPDATE_DOWNLOADED',
  UPDATE_INSTALLED: 'UPDATE_INSTALLED',
  UPDATE_ERROR: 'UPDATE_ERROR',
}

const LOCAL_STORAGE_KEY_SHOW_NEW_VERSION = 'HF_SHOW_NEW_VERSION'

const AppUpdate = () => {
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
    if (updatingState !== UPDATE_STATES.UPDATE_DOWNLOADING) {
      setUpdatingState(UPDATE_STATES.UPDATE_DOWNLOADING)
    }
    setIsShown(true)
    setDownloadProgress(Math.round(args?.percent))
  }

  const onUpdateDownloaded = () => {
    setIsShown(false)
    setUpdatingState(UPDATE_STATES.UPDATE_DOWNLOADED)
    setTimeout(() => setIsShown(true), 1000)
    setTimeout(() => {
      ipcHelpers?.sendRestartAppEvent()
      localStorage.setItem(LOCAL_STORAGE_KEY_SHOW_NEW_VERSION, newVersion)
    }, 3000)
  }

  const onUpdateError = () => {
    setUpdatingState(UPDATE_STATES.UPDATE_ERROR)
    setTimeout(closeNotification, 3000)
  }

  const onDownloadAndRestartButtonClick = () => {
    setIsShown(false)
    ipcHelpers?.sendDownloadUpdateEvent()
  }

  useEffect(() => {
    const updatedToNewVersion = localStorage.getItem(
      LOCAL_STORAGE_KEY_SHOW_NEW_VERSION,
    )
    if (updatedToNewVersion) {
      // Show a message about the successful installation of the new version
      setNewVersion(updatedToNewVersion)
      setUpdatingState(UPDATE_STATES.UPDATE_INSTALLED)
      setIsShown(true)
      localStorage.removeItem(LOCAL_STORAGE_KEY_SHOW_NEW_VERSION)
      setTimeout(() => setIsShown(false), 3000)
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
  }, [])

  return (
    <CSSTransition
      in={isShown}
      timeout={600}
      classNames='hfui-app-update__notification'
      appear
      unmountOnExit
    >
      <div
        className='hfui-app-update__notification'
      >
        {updatingState === UPDATE_STATES.UPDATE_AVAILABLE && (
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
        )}
        {updatingState === UPDATE_STATES.UPDATE_DOWNLOADING && (
        <div>
          <p className='message'>{t('appUpdate.downloading')}</p>
          <ProgressBar progress={downloadProgress} maxCompleted={100} />
        </div>
        )}
        {updatingState === UPDATE_STATES.UPDATE_DOWNLOADED && (
        <div>
          <p className='message'>{t('appUpdate.downloaded')}</p>
        </div>
        )}
        {updatingState === UPDATE_STATES.UPDATE_INSTALLED && (
        <div>
          <p className='message'>{t('appUpdate.updateInstalled')}</p>
        </div>
        )}
        {updatingState === UPDATE_STATES.UPDATE_ERROR && (
        <div>
          <p className='message'>{t('appUpdate.updateError')}</p>
        </div>
        )}
      </div>

    </CSSTransition>
  )
}

export default AppUpdate
