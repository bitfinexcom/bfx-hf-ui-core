import React, {
  memo, useMemo, useState, useEffect,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import _values from 'lodash/values'
import _map from 'lodash/map'

import { Checkbox } from '@ufx-ui/core'
import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import LanguageSettings from '../../components/Navbar/Navbar.LanguageSettings'
import Dropdown from '../../ui/Dropdown'
import {
  SETTINGS_KEYS,
  getThemeSetting,
  THEMES,
  getShouldHideOnClose,
  getIsFullscreen,
} from '../../redux/selectors/ui'
import { isElectronApp } from '../../redux/config'

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
    dispatch(WSActions.saveSettings(SETTINGS_KEYS.THEME, nextTheme))
    dispatch(GAActions.updateSettings())
    localStorage.setItem(SETTINGS_KEYS.THEME, nextTheme)
  }

  const hideOnCloseHandler = (shouldHide) => {
    setHideOnCloseChecked(shouldHide)
    dispatch(WSActions.saveSettings(SETTINGS_KEYS.HIDE_ON_CLOSE, shouldHide))
    dispatch(GAActions.updateSettings())
  }

  const fullscreenHandler = (fullscreen) => {
    setFullscreenChecked(fullscreen)
    dispatch(WSActions.saveSettings(SETTINGS_KEYS.FULLSCREEN, fullscreen))
    dispatch(GAActions.updateSettings())
    if (ipcHelpers) {
      ipcHelpers.sendChangeFullscreenEvent(fullscreen)
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

      {isElectronApp && (
        <>
          <br />
          <div className='appsettings-modal__setting'>
            <Checkbox
              onChange={hideOnCloseHandler}
              label={t('appSettings.minimizeToTrayCheckbox')}
              checked={hideOnCloseChecked}
              className='appsettings-modal__checkbox'
            />
            <div className='appsettings-modal__description'>
              {t('appSettings.minimizeToTrayText')}
            </div>
          </div>
          <div className='appsettings-modal__setting'>
            <Checkbox
              onChange={fullscreenHandler}
              label={t('appSettings.fullscreenCheckbox')}
              checked={fullscreenChecked}
              className='appsettings-modal__checkbox'
            />
          </div>
        </>
      )}
    </div>
  )
}

export default memo(AppSettings)
