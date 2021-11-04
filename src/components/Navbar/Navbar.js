import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _values from 'lodash/values'
import _map from 'lodash/map'

import { useTranslation } from 'react-i18next'
import HFIcon from '../../ui/HFIcon'
import UIActions from '../../redux/actions/ui'
import NavbarLink from './Navbar.Link'
import NavbarButton from './Navbar.Button'
import SwitchMode from '../SwitchMode'

import LayoutSettings from './Navbar.LayoutSettings'
import AppSettings from './Navbar.AppSettings'
import Routes from '../../constants/routes'
import { isElectronApp } from '../../redux/config'
import { getDarkThemeSetting } from '../../redux/selectors/ui'
// import LanguageSettings from './Navbar.LanguageSettings'

import './style.css'

const Navbar = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const settingsDarkTheme = useSelector(getDarkThemeSetting)

  return (
    <div className='hfui-navbar__wrapper'>
      <HFIcon className='hfui-navbar__logo' fill={settingsDarkTheme ? 'white' : 'black'} />
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
        <div className='hfui-exchangeinfobar__buttons'>
          <LayoutSettings />
          <NavbarButton
            alt={t('notifications.title')}
            icon='notifications'
            onClick={() => dispatch(UIActions.switchNotifcationPanel())}
          />
          {isElectronApp && <AppSettings />}
        </div>
        {isElectronApp && (
        <div className='hfui-tradingpaper__control'>
          <div className='hfui-tradingpaper__control-toggle'>
            <p>{t('main.paper')}</p>
            <SwitchMode />
          </div>
        </div>
        )}
        {/* <LanguageSettings /> TODO: hide until translations are ready */}
      </div>
    </div>
  )
}

export default Navbar
