/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo } from 'react'
import { useTranslation, Trans } from 'react-i18next'

import {
  appVersion,
  RELEASE_URL,
  API_DOCS_URL,
  SOURCE_CODE_URL,
  LICENSE_URL,
} from '../../redux/config'
import {
  PRIVACY_POLICY_URL,
  API_TERMS_CONDITIONS_URL,
  TERMS_OF_SERVICE,
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
      <p className='appsettings-modal__setting bold'>{t('appSettings.description_warning')}</p>
      <div className='appsettings-modal__setting'>
        <Trans
          t={t}
          i18nKey='appSettings.description_api'
          components={{
            url: (
              <a
                href={API_DOCS_URL}
                target='_blank'
                rel='noopener noreferrer'
              />
            ),
            bold: <b />,
          }}
        />
      </div>
      <div className='appsettings-modal__setting'>
        <Trans
          t={t}
          i18nKey='appSettings.description_license'
          components={{
            url: (
              <a href={LICENSE_URL} target='_blank' rel='noopener noreferrer' />
            ),
            bold: <b />,
          }}
        />
      </div>
      <div className='appsettings-modal__setting'>
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
          className='legal__item legal__item--bold'
          href={TERMS_OF_SERVICE}
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('appSettings.termsOfService')}
        </a>
        <a
          className='legal__item'
          href={API_TERMS_CONDITIONS_URL}
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
