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

import './style.css'

const AdvancedConfiguration = ({
  t, closeAdvanced, onSubmit, updateSetting, settingsTheme,
}) => (
  <>
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
      <Modal.Button secondary onClick={closeAdvanced}>
        {t('ui.goBack')}
      </Modal.Button>
      <Modal.Button primary onClick={onSubmit}>
        {t('ui.saveAndContinue')}
      </Modal.Button>
    </Modal.Footer>
  </>
)

const HelpUsImproveHoney = ({
  closeHelpUsImproveHoneyModal, visible, settingsTheme, // authToken,
}) => {
  const [isAdvancedConfigurationVisible, setAdvancedConfigurationVisibility] = useState(false)
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
      label={isAdvancedConfigurationVisible ? t('helpUsImproveModal.advancedConf') : t('helpUsImproveModal.title')}
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      className='help-us-improve-honey-modal'
    >
      {isAdvancedConfigurationVisible ? (
        <AdvancedConfiguration
          t={t}
          closeAdvanced={() => setAdvancedConfigurationVisibility(false)}
          onSubmit={onSubmit}
          updateSetting={updateSetting}
          settingsTheme={settingsTheme}
        />
      ) : (
        <>
          <p>
            <Trans
              t={t}
              i18nKey='helpUsImproveModal.description'
            />
          </p>
          <p>
            <Trans
              t={t}
              i18nKey='helpUsImproveModal.ppNotice'
              components={{
                privURL: (
                  <a
                    href={PRIVACY_POLICY_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                ),
                termsURL: (
                  <a
                    href={TERMS_CONDITIONS_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                ),
              }}
            />
          </p>
          <p>{t('helpUsImproveModal.weWill')}</p>
          {_map(t('helpUsImproveModal.willList', { returnObjects: true }), (item) => (
            <p key={item}>{item}</p>
          ))}
          {_map(t('helpUsImproveModal.willNotList', { returnObjects: true }), (item) => (
            <p key={item}>{item}</p>
          ))}
          <Modal.Footer>
            <Modal.Button
              secondary
              onClick={() => setAdvancedConfigurationVisibility(true)}
            >
              {t('helpUsImproveModal.advancedConf')}
            </Modal.Button>
            <Modal.Button primary onClick={onSubmit}>
              {t('helpUsImproveModal.illHelp')}
            </Modal.Button>
          </Modal.Footer>
        </>
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
