/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo } from 'react'
import { useTranslation, Trans } from 'react-i18next'

import {
  appVersion,
  RELEASE_URL,
  API_DOCS_URL,
  SOURCE_CODE_URL,
  LICENCE_URL,
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
      </div>
      <div className='appsettings-modal__setting bold'>
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
    </div>
  )
}

export default memo(About)
