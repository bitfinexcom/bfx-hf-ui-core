import React, { memo, useState, useEffect } from 'react'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { isElectronApp, appVersion, showInDevelopmentModules } from '../../redux/config'

import NavbarButton from '../Navbar/Navbar.Link'
import './style.css'

const RELEASE_URL = 'https://github.com/bitfinexcom/bfx-hf-ui/releases'

const StatusBar = ({
  wsConnected, remoteVersion,
  apiClientDisconnected: _apiClientDisconnected,
  apiClientConnecting: _apiClientConnecting,
  apiClientConnected,
  wsInterrupted, currentModeApiKeyState,
}) => {
  const [wsConnInterrupted, setWsConnInterrupted] = useState(false)
  const isWrongAPIKey = !currentModeApiKeyState.valid
  const apiClientDisconnected = isWrongAPIKey || _apiClientDisconnected
  const apiClientConnecting = !isWrongAPIKey && _apiClientConnecting

  const { t } = useTranslation()

  useEffect(() => {
    if (wsInterrupted && !wsConnInterrupted) {
      setWsConnInterrupted(true)
    }
  }, [wsConnInterrupted, wsInterrupted])

  return (
    <div className='hfui-statusbar__wrapper'>
      {isElectronApp && (
        <div className='hfui-statusbar__left'>
          <p>
            {remoteVersion && remoteVersion !== appVersion && (
              <NavbarButton
                label={t('statusbar.updateToLast')}
                external={RELEASE_URL}
              />
            )}
            &nbsp;
            v
            {appVersion}
          </p>
          {showInDevelopmentModules && <p className='dev-mode'>DEVELOPMENT Mode</p>}
        </div>
      )}

      <div className='hfui-statusbar__right'>
        {isElectronApp && (
          <>
            <span className={ClassNames('hfui-statusbar__statuscircle', {
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

        <span className={ClassNames('hfui-statusbar__statuscircle', {
          green: wsConnected && !wsConnInterrupted,
          red: !wsConnected || wsConnInterrupted,
        })}
        />
        <p>{`WS ${(wsConnected && !wsConnInterrupted) ? t('statusbar.connected') : t('statusbar.disconnected')}`}</p>
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
}

StatusBar.defaultProps = {
  remoteVersion: '',
  currentModeApiKeyState: {
    valid: false,
  },
}

export default memo(StatusBar)
