import React, { memo, useState, useEffect } from 'react'
import ClassNames from 'classnames'
import PropTypes from 'prop-types'

import { isElectronApp, appVersion } from '../../redux/config'

import NavbarButton from '../Navbar/Navbar.Link'
import './style.css'

const StatusBar = ({
  wsConnected, remoteVersion, apiClientState, wsInterrupted, currentModeApiKeyState,
}) => {
  const [wsConnInterrupted, setWsConnInterrupted] = useState(false)
  const isWrongAPIKey = !currentModeApiKeyState.valid
  const apiClientConnected = apiClientState === 2
  const apiClientConnecting = !isWrongAPIKey && apiClientState === 1
  const apiClientDisconnected = isWrongAPIKey || !apiClientState

  useEffect(() => {
    if (wsInterrupted && !wsConnInterrupted) {
      setWsConnInterrupted(true)
    }
  }, [wsInterrupted])

  return (
    <div className='hfui-statusbar__wrapper'>
      {isElectronApp && (
        <div className='hfui-statusbar__left'>
          <p>
            {remoteVersion && remoteVersion !== appVersion && (
              <NavbarButton
                label='Update to latest version'
                external='https://github.com/bitfinexcom/bfx-hf-ui/releases'
              />
            )}
            &nbsp;
            v
            {appVersion}
          </p>
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
              {apiClientConnected && 'HF Connected'}
              {apiClientConnecting && 'HF Connecting'}
              {apiClientDisconnected && 'HF Disconnected'}
            </p>
            <div className='hfui-statusbar__divide' />
          </>
        )}

        <span className={ClassNames('hfui-statusbar__statuscircle', {
          green: wsConnected && !wsConnInterrupted,
          red: !wsConnected || wsConnInterrupted,
        })}
        />
        <p>{(wsConnected && !wsConnInterrupted) ? 'WS Connected' : 'WS Disconnected'}</p>
      </div>
    </div>
  )
}

StatusBar.propTypes = {
  wsConnected: PropTypes.bool.isRequired,
  remoteVersion: PropTypes.string,
  apiClientState: PropTypes.number.isRequired,
  wsInterrupted: PropTypes.bool.isRequired,
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
