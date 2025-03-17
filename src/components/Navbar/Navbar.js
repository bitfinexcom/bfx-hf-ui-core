import React, { memo, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _values from 'lodash/values'
import _map from 'lodash/map'
import { Icon } from 'react-fa'

import { useTranslation } from 'react-i18next'
import HFIcon from '../../ui/HFIcon'
import BitfinexIcon from '../../ui/BitfinexIcon'
import Dropdown from '../../ui/SimpleDropdown'
import UIActions from '../../redux/actions/ui'
import NavbarLink from './Navbar.Link'
import NavbarButton from './Navbar.Button'
import SwitchMode from '../SwitchMode'
import CloseSessionButton from './Navbar.CloseSessionButton'
import LayoutSettings from './Navbar.LayoutSettings'
import APIBanner from './Navbar.APIBanner'
import AppSettings from './Navbar.AppSettings'
import Routes from '../../constants/routes'
import { isElectronApp } from '../../redux/config'
import {
  getThemeSetting,
  THEMES,
  getIsPaperTrading,
} from '../../redux/selectors/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

import './style.css'

const getOption = (label, url) => (
  <a
    key={label}
    className='dropdown-leaf-link'
    href={url}
    target='_blank'
    rel='noopener noreferrer'
  >
    {label}
  </a>
)

const getLeafDropdownOptions = (theme) => [
  <BitfinexIcon key='logo' fill={theme === THEMES.DARK ? 'white' : 'black'} />,
  getOption('Trading', 'https://trading.bitfinex.com/trading'),
  getOption('Wallet', 'https://movement.bitfinex.com/wallets'),
  getOption('Account', 'https://setting.bitfinex.com/account'),
  getOption('Pulse', 'https://pulse.bitfinex.com/'),
  getOption('OTC', 'https://trading.bitfinex.com/otc'),
  getOption('Leaderboard', 'https://leaderboard.bitfinex.com/'),
]

const Navbar = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const settingsTheme = useSelector(getThemeSetting)
  const isPaperTrading = useSelector(getIsPaperTrading)

  const leafOptions = useMemo(
    () => getLeafDropdownOptions(settingsTheme),
    [settingsTheme],
  )

  return (
    <div className='hfui-navbar__wrapper'>
      <HFIcon
        className='hfui-navbar__logo'
        fill={settingsTheme === THEMES.DARK ? 'white' : 'black'}
      />
      <ul className='hfui-navbar__main-links'>
        {_map(_values(Routes), ({ path, label }) => {
          return (
            <li key={path}>
              <NavbarLink
                route={path}
                label={t(label, {
                  paperPrefix: isPaperTrading ? t('main.paperPrefix') : null,
                })}
              />
            </li>
          )
        })}
      </ul>
      <div className='hfui-tradingpage__menu'>
        <div className='hfui-exchangeinfobar__buttons'>
          <LayoutSettings />
          <NavbarButton
            alt={t('notifications.title')}
            icon='notifications'
            onClick={() => dispatch(
              UIActions.toggleUIModalState(
                UI_MODAL_KEYS.NOTIFICATIONS_PANEL,
              ),
            )}
          />
          {isElectronApp && <AppSettings />}
          <Dropdown
            label={(
              <>
                <img
                  src='/bitfinex-leaf.svg'
                  className='dropdown-leaf'
                  alt=''
                />
                <Icon
                  name='chevron-down'
                  width={2}
                  className='label-chevron'
                />
              </>
              )}
            options={leafOptions}
            className='simpledropdown-wrapper'
          />
        </div>
        {isElectronApp && (
        <>
          <div className='hfui-tradingpaper__control'>
            <div className='hfui-tradingpaper__control-toggle'>
              <p>{t('main.sandbox')}</p>
              <SwitchMode />
            </div>
          </div>
          <APIBanner />
        </>
        )}
        <CloseSessionButton />
      </div>
    </div>
  )
}
export default memo(Navbar)
