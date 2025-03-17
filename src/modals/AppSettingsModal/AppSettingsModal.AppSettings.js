import React, {
  memo, useMemo, useState, useEffect,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import _values from 'lodash/values'
import _map from 'lodash/map'

import { Checkbox } from '@ufx-ui/core'
import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import LanguageSettings from '../../components/Navbar/Navbar.LanguageSettings'
import Dropdown from '../../ui/Dropdown'
import {
  SETTINGS_KEYS,
  getThemeSetting,
  THEMES,
  getShouldHideOnClose,
  getIsFullscreen,
} from '../../redux/selectors/ui'
import { isMacOS } from '../../redux/config'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import { LOG_LEVELS } from '../../constants/logging'
import TimeFormatSetting from './AppSettingsModal.TimeFormatSetting'

const ipcHelpers = window.electronService

const AppSettings = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const settingsTheme = useSelector(getThemeSetting)
  const shouldHideOnClose = useSelector(getShouldHideOnClose)
  const isFullscreen = useSelector(getIsFullscreen)
  const [currentTheme, setCurrentTheme] = useState(settingsTheme)
  const [hideOnCloseChecked, setHideOnCloseChecked] = useState(shouldHideOnClose)
  const [fullscreenChecked, setFullscreenChecked] = useState(isFullscreen)

  const themes = useMemo(
    () => _map(_values(THEMES), (value) => ({
      label: t(`appSettings.${value}`),
      value,
    })),
    [t],
  )

  useEffect(() => {
    setCurrentTheme(settingsTheme)
  }, [settingsTheme])

  useEffect(() => {
    setFullscreenChecked(isFullscreen)
  }, [isFullscreen])

  const updateTheme = (nextTheme) => {
    setCurrentTheme(nextTheme)
    dispatch(WSActions.saveSetting(SETTINGS_KEYS.THEME, nextTheme))
    localStorage.setItem(SETTINGS_KEYS.THEME, nextTheme)
  }

  const hideOnCloseHandler = (shouldHide) => {
    setHideOnCloseChecked(shouldHide)
    dispatch(WSActions.saveSetting(SETTINGS_KEYS.HIDE_ON_CLOSE, shouldHide))
  }

  const fullscreenHandler = (fullscreen) => {
    setFullscreenChecked(fullscreen)
    dispatch(WSActions.saveSetting(SETTINGS_KEYS.FULLSCREEN, fullscreen))
    dispatch(UIActions.setUIValue(UI_KEYS.isFullscreenBarShown, fullscreen))
    if (ipcHelpers) {
      ipcHelpers.sendChangeFullscreenEvent(fullscreen)
      dispatch(UIActions.logInformation('The fullscreen mode is toggled', LOG_LEVELS.INFO, 'fullscreen_toggle'))
    }
  }

  return (
    <div className='appsettings-modal__appearance_setting'>
      <div className='appsettings-modal__setting'>
        <p>{t('appSettings.language')}</p>
        <LanguageSettings />
      </div>
      <div className='appsettings-modal__setting'>
        <Dropdown
          label={t('appSettings.themeSetting')}
          onChange={updateTheme}
          value={currentTheme}
          options={themes}
        />
      </div>
      <TimeFormatSetting />
      <br />
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={hideOnCloseHandler}
          label={t('appSettings.minimizeToTrayCheckbox')}
          checked={hideOnCloseChecked}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          {t('appSettings.minimizeToTrayText', {
            key: isMacOS ? '⌘+Q' : 'Ctrl+Q',
          })}
        </div>
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={fullscreenHandler}
          label={t('appSettings.fullscreenCheckbox', {
            key: isMacOS ? '⌘+F11' : 'F11',
          })}
          checked={fullscreenChecked}
          className='appsettings-modal__checkbox'
        />
      </div>
    </div>
  )
}

export default memo(AppSettings)
