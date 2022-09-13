/* eslint-disable react/prop-types */
import React, { memo, useMemo } from 'react'
import _map from 'lodash/map'
import _isFunction from 'lodash/isFunction'
import { useTranslation } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'
import { isElectronApp } from '../../redux/config'
import Modal from '../../ui/Modal'
import {
  getUIModalStateForKey,
  getSettingsActiveTab,
} from '../../redux/selectors/ui'
import { changeUIModalState, setSettingsTab } from '../../redux/actions/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import {
  DEFAULT_TAB,
  SETTINGS_TABS,
  SETTINGS_TABS_COMPONENTS,
  WEB_SETTINGS_TABS,
} from './AppSettingsModal.constants'

import './style.css'

const AppSettingsModal = () => {
  const isOpen = useSelector((state) => getUIModalStateForKey(state, UI_MODAL_KEYS.APP_SETTINGS_MODAL))
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

  const tabs = useMemo(() => {
    return _map(isElectronApp ? SETTINGS_TABS : WEB_SETTINGS_TABS, (tab) => ({
      key: tab,
      label: t(`appSettings.${tab}`),
      component: SETTINGS_TABS_COMPONENTS[tab],
    }))
  }, [t])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      label={t('appSettings.title')}
      className='appsettings-modal'
      width={640}
      textAlign='center'
    >
      <Modal.Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </Modal>
  )
}

export default memo(AppSettingsModal)
