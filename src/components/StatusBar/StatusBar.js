import React, { memo, useState, useEffect } from 'react'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { useDispatch } from 'react-redux'
import {
  isElectronApp,
  appVersion,
  showInDevelopmentModules,
  RELEASE_URL,
} from '../../redux/config'
import { changeAppSettingsModalState, setSettingsTab } from '../../redux/actions/ui'

import NavbarButton from '../Navbar/Navbar.Link'
import { SETTINGS_TABS } from '../../modals/AppSettingsModal/AppSettingsModal.constants'

import './style.css'

const StatusBar = ({
  wsConnected,
  remoteVersion,
  apiClientDisconnected: _apiClientDisconnected,
  apiClientConnecting: _apiClientConnecting,
  apiClientConnected,
  wsInterrupted,
  currentModeApiKeyState,
  isPaperTrading,
  isBetaVersion,
}) => {
  const [wsConnInterrupted, setWsConnInterrupted] = useState(false)
  const isWrongAPIKey = !currentModeApiKeyState.valid
  const apiClientDisconnected = isWrongAPIKey || _apiClientDisconnected
  const apiClientConnecting = !isWrongAPIKey && _apiClientConnecting

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const onVersionTypeClickHandler = () => {
    dispatch(setSettingsTab(SETTINGS_TABS.About))
    dispatch(changeAppSettingsModalState(true))
  }

  useEffect(() => {
    if (wsInterrupted && !wsConnInterrupted) {
      setWsConnInterrupted(true)
    }
  }, [wsConnInterrupted, wsInterrupted])

  return (
    <div className='hfui-statusbar__wrapper'>
      <div className='hfui-statusbar__left'>
        {!isPaperTrading && (
          <div className='hfui-statusbar__desclaimer'>
            <span className='hfui-statusbar__pulse' />
            <span>{t('statusbar.liveModeDisclaimer')}</span>
          </div>
        )}
      </div>

      <div className='hfui-statusbar__right'>
        {isElectronApp && (
          <>
            <p>
              {remoteVersion && remoteVersion !== appVersion && (
                <NavbarButton
                  label={t('statusbar.updateToLast')}
                  external={RELEASE_URL}
                />
              )}
              &nbsp;
              <span>
                v
                {appVersion}
              </span>
              &nbsp;
              <span className='hfui-statusbar__beta' onClick={onVersionTypeClickHandler}>
                (
                {isBetaVersion ? 'BETA' : 'STABLE'}
                )
              </span>
            </p>
            <span
              className={ClassNames('hfui-statusbar__statuscircle', {
                green: apiClientConnected,
                yellow: apiClientConnecting,
                red: apiClientDisconnected,
              })}
            />
            <p>
              {apiClientConnected && `HF ${t('statusbar.connected')}`}
              {apiClientConnecting && `HF ${t('statusbar.connecting')}`}
              {apiClientDisconnected && `HF ${t('statusbar.disconnected')}`}
            </p>
            <div className='hfui-statusbar__divide' />
          </>
        )}

        <span
          className={ClassNames('hfui-statusbar__statuscircle', {
            green: wsConnected && !wsConnInterrupted,
            red: !wsConnected || wsConnInterrupted,
          })}
        />
        <p>
          {`WS ${
            wsConnected && !wsConnInterrupted
              ? t('statusbar.connected')
              : t('statusbar.disconnected')
          }`}

        </p>
        {showInDevelopmentModules && (
          <p className='dev-mode'>DEVELOPMENT Mode</p>
        )}
      </div>
    </div>
  )
}

StatusBar.propTypes = {
  wsConnected: PropTypes.bool.isRequired,
  remoteVersion: PropTypes.string,
  wsInterrupted: PropTypes.bool.isRequired,
  apiClientDisconnected: PropTypes.bool.isRequired,
  apiClientConnecting: PropTypes.bool.isRequired,
  apiClientConnected: PropTypes.bool.isRequired,
  currentModeApiKeyState: PropTypes.shape({
    valid: PropTypes.bool,
  }),
  isPaperTrading: PropTypes.bool.isRequired,
  isBetaVersion: PropTypes.bool.isRequired,
}

StatusBar.defaultProps = {
  remoteVersion: '',
  currentModeApiKeyState: {
    valid: false,
  },
}

export default memo(StatusBar)
