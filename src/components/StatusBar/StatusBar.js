import React, { memo } from 'react'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { useDispatch } from 'react-redux'
import {
  isElectronApp, appVersion, RELEASE_URL,
} from '../../redux/config'
import { changeUIModalState, setSettingsTab } from '../../redux/actions/ui'

import NavbarButton from '../Navbar/Navbar.Link'
import { SETTINGS_TABS } from '../../modals/AppSettingsModal/AppSettingsModal.constants'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

import './style.css'

const StatusBar = ({
  wsConnected,
  remoteVersion,
  apiClientDisconnected: _apiClientDisconnected,
  apiClientConnecting: _apiClientConnecting,
  apiClientConnected,
  wsInterrupted,
  currentModeApiKeyState,
}) => {
  const isWrongAPIKey = !currentModeApiKeyState.valid
  const apiClientDisconnected = isWrongAPIKey || _apiClientDisconnected
  const apiClientConnecting = !isWrongAPIKey && _apiClientConnecting

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const onVersionTypeClickHandler = () => {
    dispatch(setSettingsTab(SETTINGS_TABS.Beta))
    dispatch(changeUIModalState(UI_MODAL_KEYS.APP_SETTINGS_MODAL, true))
  }

  const getHFConnectionText = () => {
    if (apiClientConnected) {
      return `HF ${t('statusbar.connected')}`
    }
    if (apiClientConnecting) {
      return `HF ${t('statusbar.connecting')}`
    }
    if (apiClientDisconnected) {
      return `HF ${t('statusbar.disconnected')}`
    }
    return null
  }

  return (
    <div className={ClassNames('hfui-statusbar__wrapper')}>
      <div className='hfui-statusbar__rc'>
        <p className='hfui-statusbar__rc-disclaimer'>
          {t('lackOfSupportDisclaimer')}
        </p>
      </div>

      <div className='hfui-statusbar__right'>
        {isElectronApp && (
          <>
            <div className='hfui-statusbar__version'>
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
              <span
                className='hfui-statusbar__beta'
                onClick={onVersionTypeClickHandler}
              />
            </div>
            <span
              className={ClassNames('hfui-statusbar__statuscircle', {
                green: apiClientConnected,
                yellow: apiClientConnecting,
                red: apiClientDisconnected,
              })}
            />
            <p>{getHFConnectionText()}</p>
            <div className='hfui-statusbar__divide' />
          </>
        )}

        <span
          className={ClassNames('hfui-statusbar__statuscircle', {
            green: wsConnected && !wsInterrupted,
            red: !wsConnected || wsInterrupted,
          })}
        />
        <p>
          {`WS ${
            wsConnected && !wsInterrupted
              ? t('statusbar.connected')
              : t('statusbar.disconnected')
          }`}
        </p>
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
