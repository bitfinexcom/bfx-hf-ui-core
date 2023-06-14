/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'

import {
  appVersion,
  RELEASE_URL,
  API_DOCS_URL,
  SOURCE_CODE_URL,
  LICENCE_URL,
  HF_DESC_URL,
  DISCUSSION_BOARD_URL,
  DISCORD_URL,
} from '../../redux/config'
import {
  PRIVACY_POLICY_URL,
  TERMS_CONDITIONS_URL,
} from './AppSettingsModal.constants'
import UIActions from '../../redux/actions/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const About = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const openHelpUsImproveModal = () => {
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.HELP_US_IMPROVE_HONEY_MODAL, true))
  }

  return (
    <div>
      <div className='appsettings-modal__setting bold'>
        <a href={RELEASE_URL} target='_blank' rel='noopener noreferrer'>
          {t('appSettings.appVersion', { version: appVersion })}
        </a>
      </div>
      <div className='appsettings-modal__setting bold'>
        <Trans
          t={t}
          i18nKey='appSettings.description'
          components={{
            url: (
              <a
                href={API_DOCS_URL}
                target='_blank'
                rel='noopener noreferrer'
              />
            ),
          }}
        />
      </div>
      <div className='appsettings-modal__setting bold'>
        <Trans
          t={t}
          i18nKey='appSettings.licence'
          components={{
            url: (
              <a href={LICENCE_URL} target='_blank' rel='noopener noreferrer' />
            ),
          }}
        />
        <br />
        <Trans
          t={t}
          i18nKey='appSettings.sourceCode'
          components={{
            url: (
              <a
                href={SOURCE_CODE_URL}
                target='_blank'
                rel='noopener noreferrer'
              />
            ),
          }}
        />
      </div>
      <div className='appsettings-modal__setting light'>
        <Trans
          t={t}
          i18nKey='appSettings.discussionBoard'
          components={{
            url: (
              <a href={DISCUSSION_BOARD_URL} target='_blank' rel='noopener noreferrer' />
            ),
          }}
        />
      </div>
      <div className='appsettings-modal__setting light'>
        <Trans
          t={t}
          i18nKey='appSettings.reachOutDiscord'
          components={{
            url: (
              <a href={DISCORD_URL} target='_blank' rel='noopener noreferrer' />
            ),
          }}
        />
      </div>
      <div className='appsettings-modal__setting light'>
        <Trans
          t={t}
          i18nKey='appSettings.wipDocs'
          components={{
            url: (
              <a href={HF_DESC_URL} target='_blank' rel='noopener noreferrer' />
            ),
          }}
        />
      </div>
      <div className='appsettings-modal__setting appsettings-modal__legal light'>
        <a
          className='legal__item'
          href={TERMS_CONDITIONS_URL}
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('appSettings.apiTerms')}
        </a>
        <a
          className='legal__item'
          href={PRIVACY_POLICY_URL}
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('appSettings.bfxPrivacy')}
        </a>
      </div>
      <div className='appsettings-modal__setting appsettings-modal__legal light'>
        <span onClick={openHelpUsImproveModal}>
          Advanced privacy configuration
        </span>
      </div>
    </div>
  )
}

export default memo(About)
