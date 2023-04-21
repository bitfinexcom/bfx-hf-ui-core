/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react'
import PropTypes from 'prop-types'
import { Trans, useTranslation } from 'react-i18next'
import { ToggleSwitch } from 'react-dragswitch'
import { THEMES } from '../../redux/selectors/ui'
import { SWITCH_THEME } from '../../components/SwitchMode/SwitchMode'
import Modal from '../../ui/Modal'

const HelpUsImproveHoneySecondStep = ({
  goToFirstStep, onSubmit, updateSetting, settingsTheme,
}) => {
  const { t } = useTranslation()

  return (
    <div>
      <p>
        {t('helpUsImproveModal.3rdPartyNotice')}
      </p>
      <div className='advanced-configuration'>
        <div className='adv-setting-toggle'>
          <span>
            {t('helpUsImproveModal.unexpectedErrors')}
          </span>
          <ToggleSwitch
            checked
            onChange={updateSetting('unexpectedErrors')}
            onColor={SWITCH_THEME[settingsTheme].onColor}
            offColor={SWITCH_THEME[settingsTheme].offColor}
            className='toggle-switch'
          />
        </div>
        <p>
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.unexpectedErrorsDesc'
          />
        </p>
      </div>
      <div className='advanced-configuration'>
        <div className='adv-setting-toggle'>
          <span>
            {t('helpUsImproveModal.anonymousData')}
          </span>
          <ToggleSwitch
            checked
            onChange={updateSetting('anonymousData')}
            onColor={SWITCH_THEME[settingsTheme].onColor}
            offColor={SWITCH_THEME[settingsTheme].offColor}
            className='toggle-switch'
          />
        </div>
        <p>
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.anonymousDataDesc'
          />
        </p>
      </div>
      <div className='advanced-configuration'>
        <div className='adv-setting-toggle'>
          <span>
            {t('helpUsImproveModal.pendoUsage')}
          </span>
          <ToggleSwitch
            checked
            onChange={updateSetting('pendoUsage')}
            onColor={SWITCH_THEME[settingsTheme].onColor}
            offColor={SWITCH_THEME[settingsTheme].offColor}
            className='toggle-switch'
          />
        </div>
        <p>
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.pendoUsageDesc'
            components={{
              pendoURL: (
                <a
                  href='https://dummy-url'
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
              pendoPP: (
                <a
                  href='https://dummy-url'
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </p>
      </div>
      <Modal.Footer>
        <Modal.Button secondary onClick={goToFirstStep}>
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
  updateSetting: PropTypes.func.isRequired,
  settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
}

export default HelpUsImproveHoneySecondStep
