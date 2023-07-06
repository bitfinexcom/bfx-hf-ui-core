/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react'
import PropTypes from 'prop-types'
import { Trans, useTranslation } from 'react-i18next'
import { Intent } from '@ufx-ui/core'
import { ToggleSwitch } from 'react-dragswitch'
import { THEMES } from '../../redux/selectors/ui'
import { SWITCH_THEME } from '../../components/SwitchMode/SwitchMode'
import Modal from '../../ui/Modal'
import {
  METRICS_CODE_REF_URL,
  UNIQUE_ID_CODE_REF_URL,
} from '../../redux/config'

const HelpUsImproveHoneySecondStep = ({
  goToFirstStep,
  onSubmit,
  settingsTheme,
  optinCrashReports,
  setOptinCrashReports,
  optinBFXAnalytics,
  setOptinBFXAnalytics,
}) => {
  const { t } = useTranslation()

  return (
    <div>
      <p>{t('helpUsImproveModal.3rdPartyNotice')}</p>
      <div className='advanced-configuration'>
        <div className='adv-setting-toggle'>
          <span>{t('helpUsImproveModal.unexpectedErrors')}</span>
          <ToggleSwitch
            checked={optinCrashReports}
            onChange={setOptinCrashReports}
            onColor={SWITCH_THEME[settingsTheme].onColor}
            offColor={SWITCH_THEME[settingsTheme].offColor}
            className='toggle-switch'
          />
        </div>
        <p>
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.unexpectedErrorsDesc'
            components={{
              codeRefUrl: (
                <a
                  href={METRICS_CODE_REF_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </p>
      </div>
      <div className='advanced-configuration'>
        <div className='adv-setting-toggle'>
          <span>{t('helpUsImproveModal.anonymousData')}</span>
          <ToggleSwitch
            checked={optinBFXAnalytics}
            onChange={setOptinBFXAnalytics}
            onColor={SWITCH_THEME[settingsTheme].onColor}
            offColor={SWITCH_THEME[settingsTheme].offColor}
            className='toggle-switch'
          />
        </div>
        <p>
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.anonymousDataDesc'
            components={{
              codeRefUrl: (
                <a
                  href={UNIQUE_ID_CODE_REF_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </p>
      </div>
      <Modal.Footer>
        <Modal.Button intent={Intent.NONE} onClick={goToFirstStep}>
          {t('ui.goBack')}
        </Modal.Button>
        <Modal.Button primary onClick={onSubmit}>
          {t('ui.saveAndContinue')}
        </Modal.Button>
      </Modal.Footer>
    </div>
  )
}

HelpUsImproveHoneySecondStep.propTypes = {
  goToFirstStep: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  optinCrashReports: PropTypes.bool.isRequired,
  setOptinCrashReports: PropTypes.func.isRequired,
  optinBFXAnalytics: PropTypes.bool.isRequired,
  setOptinBFXAnalytics: PropTypes.func.isRequired,
  settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
}

export default HelpUsImproveHoneySecondStep
