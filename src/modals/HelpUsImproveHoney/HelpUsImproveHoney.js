/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation, Trans } from 'react-i18next'
import _map from 'lodash/map'

import Modal from '../../ui/Modal'
import { PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL } from '../AppSettingsModal/AppSettingsModal.constants'

import './style.css'

const HelpUsImproveHoney = ({
  closeHelpUsImproveHoneyModal, visible, // authToken,
}) => {
  const { t } = useTranslation()

  const onClose = () => {
    closeHelpUsImproveHoneyModal()
  }

  const onSubmit = () => {
    onClose()
  }

  return (
    <Modal
      label={t('helpUsImproveModal.title')}
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      className='help-us-improve-honey-modal'
    >
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
        <Modal.Button secondary onClick={onClose}>
          {t('helpUsImproveModal.advancedConf')}
        </Modal.Button>
        <Modal.Button primary onClick={onSubmit}>
          {t('helpUsImproveModal.illHelp')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

HelpUsImproveHoney.propTypes = {
  closeHelpUsImproveHoneyModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  // authToken: PropTypes.string.isRequired,
}

export default memo(HelpUsImproveHoney)
