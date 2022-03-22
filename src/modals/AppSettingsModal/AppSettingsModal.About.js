/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import NavbarLink from '../../components/Navbar/Navbar.Link'

import {
  appVersion, RELEASE_URL, API_DOCS_URL, SOURCE_CODE_URL, LICENCE_URL, HF_DESC_URL,
} from '../../redux/config'
import { getIsBetaVersion } from '../../redux/selectors/ui'
import { PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL } from './AppSettingsModal.constants'

const About = () => {
  const { t } = useTranslation()

  return (
    <div>
      <div className='appsettings-modal__title'>
        {t('appSettings.aboutTab')}
      </div>
      <div className='appsettings-modal__setting'>
        <a
          href={RELEASE_URL}
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('appSettings.appVersion', { version: appVersion })}
        </a>
      </div>
      <div className='appsettings-modal__setting'>
        <Trans
          t={t}
          i18nKey='appSettings.description'
          components={{
            url: <a href={API_DOCS_URL} target='_blank' rel='noopener noreferrer' />,
          }}
        />
      </div>
      <div className='appsettings-modal__setting'>
        <Trans
          t={t}
          i18nKey='appSettings.licence'
          components={{
            url: <a href={LICENCE_URL} target='_blank' rel='noopener noreferrer' />,
          }}
        />
        <br />
        <Trans
          t={t}
          i18nKey='appSettings.sourceCode'
          components={{
            url: <a href={SOURCE_CODE_URL} target='_blank' rel='noopener noreferrer' />,
          }}
        />
      </div>
      <div className='appsettings-modal__setting'>
        <Trans
          t={t}
          i18nKey='appSettings.moreInfo'
          components={{
            url: <a href={HF_DESC_URL} target='_blank' rel='noopener noreferrer' />,
          }}
        />
      </div>
      {getIsBetaVersion
      && (
      <div className='appsettings-modal__api-configuration-message is-success'>
        {t('appSettings.betaDesclaimer')}
      </div>
      )}
      <div className='appsettings-modal__links'>
        <NavbarLink external={TERMS_CONDITIONS_URL} label={t('appSettings.termsConditions')} />
        <NavbarLink external={PRIVACY_POLICY_URL} label={t('appSettings.privacyPolicy')} />
      </div>
    </div>
  )
}

export default memo(About)
