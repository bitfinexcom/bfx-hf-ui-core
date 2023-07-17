/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation, Trans } from 'react-i18next'
import { Icon } from 'react-fa'
import { Intent } from '@ufx-ui/core'
import {
  PRIVACY_POLICY_URL,
  TERMS_CONDITIONS_URL,
} from '../AppSettingsModal/AppSettingsModal.constants'
import Modal from '../../ui/Modal'
import { PENDO_CODE_REF_URL, UNIQUE_ID_CODE_REF_URL } from '../../redux/config'

const HelpUsImproveHoneyModalFirstStep = ({ onSubmit, goToSecondStep }) => {
  const { t } = useTranslation()

  return (
    <div>
      <p>
        <Trans t={t} i18nKey='helpUsImproveModal.description' />
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
      <ul>
        <li className='will-list-item'>
          <Icon name='check' className='check-icon' />
          <Trans t={t} i18nKey='helpUsImproveModal.willItem1' />
        </li>
        <li className='will-list-item'>
          <Icon name='check' className='check-icon' />
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.willItem2'
            components={{
              bold: <b />,
              codeRefUrl: (
                <a
                  href={PENDO_CODE_REF_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </li>
        <li className='will-list-item'>
          <Icon name='check' className='check-icon' />
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.willItem3'
            components={{
              bold: <b />,
              codeRefUrl: (
                <a
                  href={UNIQUE_ID_CODE_REF_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </li>
        <li className='will-list-item'>
          <Icon name='times' className='times-icon' />
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.willNotItem1'
            components={{
              bold: <b />,
            }}
          />
        </li>
        <li className='will-list-item'>
          <Icon name='times' className='times-icon' />
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.willNotItem2'
            components={{
              bold: <b />,
            }}
          />
        </li>
        <li className='will-list-item'>
          <Icon name='times' className='times-icon' />
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.willNotItem3'
            components={{
              bold: <b />,
            }}
          />
        </li>
      </ul>
      <Modal.Footer>
        <Modal.Button intent={Intent.NONE} onClick={goToSecondStep}>
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
