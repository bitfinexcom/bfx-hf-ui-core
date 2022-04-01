/* eslint-disable react/prop-types */
import React, { useState, memo } from 'react'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _isFunction from 'lodash/isFunction'
import cx from 'clsx'
import { useTranslation } from 'react-i18next'

import { isElectronApp } from '../../redux/config'
import Modal from '../../ui/Modal'
import GeneralTab from './AppSettingsModal.General'
import ApiKeysTab from './AppSettingsModal.ApiKeys'
import TradingModeTab from './AppSettingsModal.TradingMode'
import AppearanceTab from './AppSettingsModal.Appearance'
import AboutTab from './AppSettingsModal.About'

import './style.css'

const Tabs = {
  General: 'appSettings.generalTab',
  TradingMode: 'appSettings.tradingModeTab',
  Keys: 'appSettings.apiKeys',
  Appearance: 'appSettings.appearanceTab',
  About: 'appSettings.aboutTab',
}

const webTabs = [
  Tabs.Appearance, Tabs.About,
]

const defaultTab = isElectronApp ? Tabs.General : Tabs.Appearance

const AppSettingsModal = ({
  isOpen,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const onClose = (callback) => {
    // reset to default tab, but wait for transition out
    setTimeout(() => {
      setActiveTab(defaultTab)

      if (_isFunction(callback)) {
        callback()
      }
    }, 200)
  }
  const { t } = useTranslation()

  const tabs = isElectronApp ? _values(Tabs) : webTabs

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
        {_map(tabs, tab => (
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
        {isElectronApp && (
          <>
            {activeTab === Tabs.General && <GeneralTab />}
            {activeTab === Tabs.Keys && <ApiKeysTab />}
            {activeTab === Tabs.TradingMode && <TradingModeTab onClose={onClose} />}
          </>
        )}
        {activeTab === Tabs.Appearance && <AppearanceTab />}
        {activeTab === Tabs.About && <AboutTab />}
      </div>
    </Modal>
  )
}

export default memo(AppSettingsModal)
