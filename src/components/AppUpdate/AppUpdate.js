import React, { useState, useEffect } from 'react'
import cx from 'clsx'
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

const AppUpdate = () => {
  const { t } = useTranslation()

  const [hideNotification, setHideNotification] = useState(true)
  const [newVersion, setNewVersion] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [updatingState, setUpdatingState] = useState(null)

  const closeNotification = () => {
    setHideNotification(true)
    ipcHelpers?.sendClearAppUpdateTimerEvent()
  }

  const onUpdateAvailable = (_, args) => {
    setNewVersion(args?.version)
    setUpdatingState(UPDATE_STATES.UPDATE_AVAILABLE)
    setHideNotification(false)
  }

  const onUpdateDownloading = (_, args) => {
    setDownloadProgress(args?.percent)
  }

  const onUpdateDownloaded = () => {
    setUpdatingState(UPDATE_STATES.UPDATE_DOWNLOADED)
    setTimeout(() => {
      ipcHelpers?.sendRestartAppEvent()
    }, 3000)
  }

  const onUpdateError = () => {
    setUpdatingState(UPDATE_STATES.UPDATE_ERROR)
    setTimeout(closeNotification, 3000)
  }

  useEffect(() => {
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

  const onDownloadAndRestartButtonClick = () => {
    ipcHelpers?.sendDownloadUpdateEvent()
  }

  return (
    <div
      className={cx('hfui-app-update__notification', {
        hidden: hideNotification,
      })}
    >
      {updatingState === UPDATE_STATES.UPDATE_AVAILABLE && (
        <div>
          <p className='message'>
            {t('appUpdate.available', { version: newVersion })}
          </p>
          <div className='btn-group'>
            <button className='close-button' type='button' onClick={onDownloadAndRestartButtonClick}>
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
  )
}

export default AppUpdate
