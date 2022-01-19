/* eslint-disable react/prop-types */
import React, { useState, memo } from 'react'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _isFunction from 'lodash/isFunction'
import cx from 'clsx'
import { useTranslation } from 'react-i18next'

import Modal from '../../ui/Modal'
import GeneralTab from './AppSettingsModal.General'
import ApiKeysTab from './AppSettingsModal.ApiKeys'
import TradingModeTab from './AppSettingsModal.TradingMode'

import './style.css'

const Tabs = {
  General: 'appSettings.generalTab',
  TradingMode: 'appSettings.tradingModeTab',
  Keys: 'appSettings.apiKeys',
}

const defaultTab = Tabs.General

const AppSettingsModal = ({
  isOpen,
  onClose: onModalClose,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const onClose = (callback) => {
    onModalClose()

    // reset to default tab, but wait for transition out
    setTimeout(() => {
      setActiveTab(defaultTab)

      if (_isFunction(callback)) {
        callback()
      }
    }, 200)
  }
  const { t } = useTranslation()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      label={t('appSettings.title')}
      className='appsettings-modal'
      width={640}
      textAlign='center'
    >
      <div className='appsettings-modal__tabs'>
        {_map(_values(Tabs), tab => (
          <div
            key={tab}
            className={cx('appsettings-modal__tab', {
              'is-active': tab === activeTab,
            })}
            onClick={() => setActiveTab(tab)}
          >
            {t(tab)}
          </div>
        ))}
      </div>
      <div className='appsettings-modal__content'>
        {activeTab === Tabs.General && <GeneralTab />}
        {activeTab === Tabs.Keys && <ApiKeysTab />}
        {activeTab === Tabs.TradingMode && <TradingModeTab onClose={onClose} />}
      </div>
    </Modal>
  )
}

export default memo(AppSettingsModal)
