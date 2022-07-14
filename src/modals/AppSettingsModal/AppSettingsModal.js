/* eslint-disable react/prop-types */
import React, { memo } from 'react'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _isFunction from 'lodash/isFunction'
import cx from 'clsx'
import { useTranslation } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'
import { isElectronApp } from '../../redux/config'
import Modal from '../../ui/Modal'
import GeneralTab from './AppSettingsModal.General'
import ApiKeysTab from './AppSettingsModal.ApiKeys'
import TradingModeTab from './AppSettingsModal.TradingMode'
import AppearanceTab from './AppSettingsModal.Appearance'
import AboutTab from './AppSettingsModal.About'
import BetaTab from './AppSettingsModal.Beta'
import { getIsAppSettingsModalVisible, getSettingsActiveTab } from '../../redux/selectors/ui'
import { changeAppSettingsModalState, setSettingsTab } from '../../redux/actions/ui'
import { DEFAULT_TAB, SETTINGS_TABS, WEB_SETTINGS_TABS } from './AppSettingsModal.constants'

import './style.css'

const AppSettingsModal = () => {
  const isOpen = useSelector(getIsAppSettingsModalVisible)
  const activeTab = useSelector(getSettingsActiveTab)

  const dispatch = useDispatch()

  const setActiveTab = (tab) => dispatch(setSettingsTab(tab))

  const onClose = (callback) => {
    dispatch(changeAppSettingsModalState(false))

    // reset to default tab, but wait for transition out
    setTimeout(() => {
      setActiveTab(DEFAULT_TAB)

      if (_isFunction(callback)) {
        callback()
      }
    }, 200)
  }
  const { t } = useTranslation()

  const tabs = isElectronApp ? _values(SETTINGS_TABS) : WEB_SETTINGS_TABS

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
      <div className={activeTab === SETTINGS_TABS.Keys ? '' : 'appsettings-modal__content'}>
        {isElectronApp && (
          <>
            {activeTab === SETTINGS_TABS.Beta && <BetaTab />}
            {activeTab === SETTINGS_TABS.General && <GeneralTab />}
            {activeTab === SETTINGS_TABS.Keys && <ApiKeysTab />}
            {activeTab === SETTINGS_TABS.TradingMode && <TradingModeTab onClose={onClose} />}
          </>
        )}
        {activeTab === SETTINGS_TABS.Appearance && <AppearanceTab />}
        {activeTab === SETTINGS_TABS.About && <AboutTab />}
      </div>
    </Modal>
  )
}

export default memo(AppSettingsModal)
