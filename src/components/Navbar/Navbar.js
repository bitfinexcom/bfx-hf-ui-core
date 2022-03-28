import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _values from 'lodash/values'
import _map from 'lodash/map'
import cx from 'clsx'

import { useTranslation } from 'react-i18next'
import HFIcon from '../../ui/HFIcon'
import UIActions from '../../redux/actions/ui'
import NavbarLink from './Navbar.Link'
import NavbarButton from './Navbar.Button'
import SwitchMode from '../SwitchMode'
import Logout from './Navbar.Logout'

import LayoutSettings from './Navbar.LayoutSettings'
import AppSettings from './Navbar.AppSettings'
import Routes, { strategyEditor } from '../../constants/routes'
import { isElectronApp } from '../../redux/config'
import {
  getThemeSetting, THEMES, getIsPaperTrading, getIsBetaVersion, getIsStrategiesTabVisible,
} from '../../redux/selectors/ui'

import './style.css'

const Navbar = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const settingsTheme = useSelector(getThemeSetting)
  const isPaperTrading = useSelector(getIsPaperTrading)
  const isBetaVersion = useSelector(getIsBetaVersion)
  const isStrategiesTabVisible = useSelector(getIsStrategiesTabVisible)
  const showStrategies = isBetaVersion || isStrategiesTabVisible

  return (
    <div className='hfui-navbar__wrapper'>
      <HFIcon className='hfui-navbar__logo' fill={settingsTheme === THEMES.DARK ? 'white' : 'black'} />
      <ul className='hfui-navbar__main-links'>
        {_map(_values(Routes), ({ path, label }) => {
          return showStrategies || path !== strategyEditor.path
            ? (
              <li key={path}>
                <NavbarLink
                  route={path}
                  label={t(label, { paperPrefix: isPaperTrading ? t('main.paperPrefix') : null })}
                />
              </li>
            )
            : null
        })}
      </ul>
      <div className='hfui-tradingpage__menu'>
        <div className={cx('hfui-exchangeinfobar__buttons', { 'is-web': !isElectronApp })}>
          <LayoutSettings />
          <NavbarButton
            alt={t('notifications.title')}
            icon='notifications'
            onClick={() => dispatch(UIActions.switchNotifcationPanel())}
          />
          <AppSettings />
          {!isElectronApp && (
            <Logout />
          )}
        </div>
        {isElectronApp && (
          <div className='hfui-tradingpaper__control'>
            <div className='hfui-tradingpaper__control-toggle'>
              <p>{t('main.sandbox')}</p>
              <SwitchMode />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default memo(Navbar)
