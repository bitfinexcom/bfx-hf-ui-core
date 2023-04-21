/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import { useTranslation, Trans } from 'react-i18next'
import { PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL } from '../AppSettingsModal/AppSettingsModal.constants'
import Modal from '../../ui/Modal'

const HelpUsImproveHoneyModalFirstStep = ({ onSubmit, goToSecondStep }) => {
  const { t } = useTranslation()

  return (
    <div>
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
          onClick={goToSecondStep}
        >
          {t('helpUsImproveModal.advancedConf')}
        </Modal.Button>
        <Modal.Button primary onClick={onSubmit}>
          {t('helpUsImproveModal.illHelp')}
        </Modal.Button>
      </Modal.Footer>
    </div>
  )
}

HelpUsImproveHoneyModalFirstStep.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  goToSecondStep: PropTypes.func.isRequired,
}

export default memo(HelpUsImproveHoneyModalFirstStep)
