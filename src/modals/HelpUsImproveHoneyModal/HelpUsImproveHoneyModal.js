/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation, Trans } from 'react-i18next'
import { ToggleSwitch } from 'react-dragswitch'
import _map from 'lodash/map'

import Modal from '../../ui/Modal'
import { PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL } from '../AppSettingsModal/AppSettingsModal.constants'
import { SWITCH_THEME } from '../../components/SwitchMode/SwitchMode'
import { THEMES } from '../../redux/selectors/ui'
import HelpUsImproveHoneyModalFirstStep from './HelpUsImproveHoneyModal.FirstStep'
import HelpUsImproveHoneySecondStep from './HelpUsImproveHoneyModal.SecondStep'
import useToggle from '../../hooks/useToggle'

import './style.css'

const HelpUsImproveHoney = ({
  closeHelpUsImproveHoneyModal, visible, settingsTheme, // authToken,
}) => {
  const [isFirstStep,, goToFirstStep, goToSecondStep] = useToggle(true)
  const { t } = useTranslation()

  const onClose = () => {
    closeHelpUsImproveHoneyModal()
  }

  const onSubmit = () => {
    onClose()
  }

  const updateSetting = (setting) => (value) => {
    console.log(setting, value)
  }

  return (
    <Modal
      label={isFirstStep ? t('helpUsImproveModal.title') : t('helpUsImproveModal.advancedConf')}
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      className='help-us-improve-honey-modal'
    >
      {isFirstStep
        ? (
          <HelpUsImproveHoneyModalFirstStep
            onSubmit={onSubmit}
            goToSecondStep={goToSecondStep}
          />
        )
        : (
          <HelpUsImproveHoneySecondStep
            goToFirstStep={goToFirstStep}
            onSubmit={onSubmit}
            updateSetting={updateSetting}
            settingsTheme={settingsTheme}
          />
        )}
    </Modal>
  )
}

HelpUsImproveHoney.propTypes = {
  closeHelpUsImproveHoneyModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  // authToken: PropTypes.string.isRequired,
  settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
}

export default memo(HelpUsImproveHoney)
