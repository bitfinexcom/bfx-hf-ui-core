/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Modal from '../../ui/Modal'
import { SETTINGS_KEYS, THEMES } from '../../redux/selectors/ui'
import HelpUsImproveHoneyModalFirstStep from './HelpUsImproveHoneyModal.FirstStep'
import HelpUsImproveHoneySecondStep from './HelpUsImproveHoneyModal.SecondStep'
import useToggle from '../../hooks/useToggle'

import './style.css'

const HelpUsImproveHoney = ({
  closeHelpUsImproveHoneyModal,
  visible,
  settingsTheme,
  updateSettings,
}) => {
  const [isFirstStep, , goToFirstStep, goToSecondStep] = useToggle(true)
  const [optinCrashReports, setOptinCrashReports] = useState(true)
  const [optinBFXAnalytics, setOptinBFXAnalytics] = useState(true)

  const { t } = useTranslation()

  const onSubmit = () => {
    if (isFirstStep) {
      updateSettings({
        [SETTINGS_KEYS.OPT_IN_CRASH_REPORTS]: true,
        [SETTINGS_KEYS.OPT_IN_BFX_ANALYTICS]: true,
        [SETTINGS_KEYS.SHOW_OPT_IN_MODAL]: false,
      })
    } else {
      updateSettings({
        [SETTINGS_KEYS.OPT_IN_CRASH_REPORTS]: optinCrashReports,
        [SETTINGS_KEYS.OPT_IN_BFX_ANALYTICS]: optinBFXAnalytics,
        [SETTINGS_KEYS.SHOW_OPT_IN_MODAL]: false,
      })
    }

    closeHelpUsImproveHoneyModal()
  }

  return (
    <Modal
      label={
        isFirstStep
          ? t('helpUsImproveModal.title')
          : t('helpUsImproveModal.advancedConf')
      }
      isOpen={visible}
      onClose={() => {}}
      onSubmit={onSubmit}
      isCloseButtonShown={false}
      canOutsideClickClose={false}
      className='help-us-improve-honey-modal'
    >
      {isFirstStep ? (
        <HelpUsImproveHoneyModalFirstStep
          onSubmit={onSubmit}
          goToSecondStep={goToSecondStep}
        />
      ) : (
        <HelpUsImproveHoneySecondStep
          goToFirstStep={goToFirstStep}
          onSubmit={onSubmit}
          settingsTheme={settingsTheme}
          optinCrashReports={optinCrashReports}
          setOptinCrashReports={setOptinCrashReports}
          optinBFXAnalytics={optinBFXAnalytics}
          setOptinBFXAnalytics={setOptinBFXAnalytics}
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
  updateSettings: PropTypes.func.isRequired,
}

export default memo(HelpUsImproveHoney)
