import React, { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'react-fa'
import _values from 'lodash/values'
import _map from 'lodash/map'
import cx from 'clsx'

import { useTranslation } from 'react-i18next'
import HFIcon from '../../ui/HFIcon'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import NavbarLink from './Navbar.Link'
import NavbarButton from './Navbar.Button'
import SwitchMode from '../SwitchMode'
import Logout from './Navbar.Logout'

import LayoutSettings from './Navbar.LayoutSettings'
import AppSettings from './Navbar.AppSettings'
import Routes from '../../constants/routes'
import { isElectronApp } from '../../redux/config'
import { getThemeSetting, THEMES, SETTINGS } from '../../redux/selectors/ui'
import LanguageSettings from './Navbar.LanguageSettings'

import './style.css'

const Navbar = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const settingsTheme = useSelector(getThemeSetting)
  const themeIconName = settingsTheme === THEMES.DARK ? 'sun-o' : 'moon-o'

  const switchTheme = useCallback(() => {
    const nextTheme = settingsTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    dispatch(WSActions.saveSettings(SETTINGS.THEME, nextTheme))
    dispatch(GAActions.updateSettings())
    localStorage.setItem(SETTINGS.THEME, nextTheme)
  }, [dispatch, settingsTheme])

  return (
    <div className='hfui-navbar__wrapper'>
      <HFIcon className='hfui-navbar__logo' fill={settingsTheme === THEMES.DARK ? 'white' : 'black'} />
      <ul className='hfui-navbar__main-links'>
        {_map(_values(Routes), ({ path, label }) => (
          <li key={path}>
            <NavbarLink
              route={path}
              label={t(label)}
            />
          </li>
        ))}
      </ul>
      <div className='hfui-tradingpage__menu'>
        <div className={cx('hfui-exchangeinfobar__buttons', { 'is-web': !isElectronApp })}>
          <LayoutSettings />
          <NavbarButton
            alt={t('notifications.title')}
            icon='notifications'
            onClick={() => dispatch(UIActions.switchNotifcationPanel())}
          />
          {isElectronApp ? (
            <AppSettings />
          ) : (
            <>
              <button
                type='button'
                className='hfui-exchangeinfobar__button'
                onClick={switchTheme}
                alt={t('appSettings.themeSetting')}
              >
                <Icon name={themeIconName} />
              </button>
              <Logout />
            </>
          )}
        </div>
        {isElectronApp && (
          <div className='hfui-tradingpaper__control'>
            <div className='hfui-tradingpaper__control-toggle'>
              <p>{t('main.paper')}</p>
              <SwitchMode />
            </div>
          </div>
        )}
        <LanguageSettings />
      </div>
    </div>
  )
}

export default memo(Navbar)
