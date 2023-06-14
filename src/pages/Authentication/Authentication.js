import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import HFIcon from '../../ui/HFIcon'
import AuthenticationInitForm from './AuthenticationInitForm'
import AuthenticationUnlockForm from './AuthenticationUnlockForm'
import AuthenticationConnectingForm from './AuthenticationConnectingForm'
import { isElectronApp, appVersion } from '../../redux/config'
import { getThemeSetting, THEMES } from '../../redux/selectors/ui'
import useToggle from '../../hooks/useToggle'
import ResetDataConfirmModal from '../../modals/ResetDataConfirmModal'
import { LOG_LEVELS } from '../../constants/logging'
import RCDisclaimer from '../../components/RCDisclaimer/RCDisclaimer'

import './style.css'

const Authentication = ({
  wsConnected,
  configured,
  onUnlock,
  onInit,
  isPaperTrading,
  logInformation,
}) => {
  const [
    isConfirmResetDataModalOpen,,
    _showConfirmResetDataModal,
    closeConfirmResetDataModal,
  ] = useToggle(false)

  const { t } = useTranslation()
  const settingsTheme = useSelector(getThemeSetting)

  const showConfirmResetDataModal = () => {
    logInformation('Clear data & Reset requested', LOG_LEVELS.INFO, 'clear_data_requested')
    _showConfirmResetDataModal()
  }

  return (
    <div className='hfui-authenticationpage__wrapper'>
      <RCDisclaimer />
      <div className='hfui-authenticationpage__inner'>
        <div className='hfui-authenticationpage__inner-left'>
          <HFIcon fill={settingsTheme === THEMES.DARK ? 'white' : 'black'} />
          <div className='hfui-authenticationpage__inner-left-version-container'>
            <div className='hfui-authenticationpage__inner-left-version'>
              <h6>{t('main.craftedBy')}</h6>
              {isElectronApp && (
              <p>
                v
                {appVersion}
              </p>
              )}
            </div>
          </div>
        </div>

        {!wsConnected ? (
          <AuthenticationConnectingForm />
        ) : configured ? (
          <AuthenticationUnlockForm
            onUnlock={onUnlock}
            isPaperTrading={isPaperTrading}
            showConfirmResetDataModal={showConfirmResetDataModal}
          />
        ) : (
          <AuthenticationInitForm onInit={onInit} />
        )}
      </div>
      <ResetDataConfirmModal
        isOpen={isConfirmResetDataModalOpen}
        onClose={closeConfirmResetDataModal}
        logInformation={logInformation}
      />
    </div>
  )
}

Authentication.propTypes = {
  wsConnected: PropTypes.bool.isRequired,
  configured: PropTypes.bool.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  onUnlock: PropTypes.func.isRequired,
  onInit: PropTypes.func.isRequired,
  logInformation: PropTypes.func.isRequired,
}

export default memo(Authentication)
