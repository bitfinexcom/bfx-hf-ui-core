/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import NavbarLink from '../../components/Navbar/Navbar.Link'

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

const About = () => {
  const { t } = useTranslation()

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
      <div className='appsettings-modal__setting light'>
        <a href={TERMS_CONDITIONS_URL} target='_blank' rel='noopener noreferrer'>
          {t('appSettings.apiTerms')}
        </a>
        <br />
        <br />
        <a href={PRIVACY_POLICY_URL} target='_blank' rel='noopener noreferrer'>
          {t('appSettings.bfxPrivacy')}
        </a>
      </div>
      <div className='appsettings-modal__legal'>
        <p>
          <NavbarLink
            external={TERMS_CONDITIONS_URL}
            label={t('appSettings.termsConditions')}
          />
        </p>
        <div className='appsettings-modal__legal-disclaimer'>
          <Trans
            t={t}
            i18nKey='appSettings.privacyDisclaimer1'
            components={{
              p: <p />,
              bold: <b />,
            }}
          />
          <Trans
            t={t}
            i18nKey='appSettings.privacyDisclaimer2'
            components={{
              p: <p />,
              bold: <b />,
            }}
          />
          <Trans
            t={t}
            i18nKey='appSettings.privacyDisclaimer3'
            components={{
              p: <p />,
              url: (
                <a
                  href={PRIVACY_POLICY_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(About)
