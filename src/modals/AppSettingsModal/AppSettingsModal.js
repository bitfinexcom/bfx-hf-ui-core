/* eslint-disable react/prop-types */
import React, { memo } from 'react'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _isFunction from 'lodash/isFunction'
import cx from 'clsx'
import { useTranslation } from 'react-i18next'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { useDispatch, useSelector } from 'react-redux'
import { isElectronApp } from '../../redux/config'
import Modal from '../../ui/Modal'
import GeneralTab from './AppSettingsModal.General'
import ApiKeysTab from './AppSettingsModal.ApiKeys'
import AppSettings from './AppSettingsModal.AppSettings'
import AboutTab from './AppSettingsModal.About'
import BetaTab from './AppSettingsModal.Beta'
import { getUIModalStateForKey, getSettingsActiveTab } from '../../redux/selectors/ui'
import { changeUIModalState, setSettingsTab } from '../../redux/actions/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { DEFAULT_TAB, SETTINGS_TABS, WEB_SETTINGS_TABS } from './AppSettingsModal.constants'

import './style.css'

const cssTransitionProps = {
  timeout: 300,
  classNames: 'setting',
}

const renderCell = (tab, activeTab, element) => {
  if (!isElectronApp || activeTab !== tab) {
    return null
  }

  return (
    <CSSTransition key={tab} {...cssTransitionProps}>
      {element}
    </CSSTransition>
  )
}

const AppSettingsModal = () => {
  const isOpen = useSelector(state => getUIModalStateForKey(state, UI_MODAL_KEYS.APP_SETTINGS_MODAL))
  const activeTab = useSelector(getSettingsActiveTab)

  const dispatch = useDispatch()

  const setActiveTab = (tab) => dispatch(setSettingsTab(tab))

  const onClose = (callback) => {
    dispatch(changeUIModalState(UI_MODAL_KEYS.APP_SETTINGS_MODAL, false))

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

      <TransitionGroup
        exit={false}
        className={cx('content-all', {
          'appsettings-modal__content': activeTab !== SETTINGS_TABS.Keys,
        })}
      >
        {renderCell(SETTINGS_TABS.Beta, activeTab, <BetaTab />)}
        {renderCell(SETTINGS_TABS.General, activeTab, <GeneralTab />)}
        {renderCell(SETTINGS_TABS.Keys, activeTab, <ApiKeysTab />)}
        {renderCell(SETTINGS_TABS.AppSettings, activeTab, <AppSettings />)}
        {renderCell(SETTINGS_TABS.About, activeTab, <AboutTab />)}
      </TransitionGroup>
    </Modal>
  )
}

export default memo(AppSettingsModal)
