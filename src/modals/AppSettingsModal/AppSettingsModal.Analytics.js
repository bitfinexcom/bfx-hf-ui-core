/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '@ufx-ui/core'
import { Trans, useTranslation } from 'react-i18next'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import {
  SETTINGS_KEYS,
  getOptinCrashReports,
  getOptinBFXAnalytics,
  getOptinVendorPendo,
} from '../../redux/selectors/ui'
import {
  METRICS_CODE_REF_URL,
  PENDO_CODE_REF_URL,
  PENDO_PRIVACY_POLICY_URL,
  PENDO_WEB_URL,
  UNIQUE_ID_CODE_REF_URL,
} from '../../redux/config'
// import InnerModal from '../../ui/InnerModal/InnerModal'

const Analytics = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const optinCrashReports = useSelector(getOptinCrashReports)
  const optinBFXAnalytics = useSelector(getOptinBFXAnalytics)
  const optinVendorPendo = useSelector(getOptinVendorPendo)

  const optinCrashReportsHandler = (isChecked) => {
    dispatch(
      WSActions.saveSetting(SETTINGS_KEYS.OPT_IN_CRASH_REPORTS, isChecked),
    )
    dispatch(GAActions.updateSettings())
  }

  const optinBFXAnalyticsHandler = (isChecked) => {
    dispatch(
      WSActions.saveSetting(SETTINGS_KEYS.OPT_IN_BFX_ANALYTICS, isChecked),
    )
    dispatch(GAActions.updateSettings())
  }

  const optinVendorPendoHandler = (isChecked) => {
    dispatch(
      WSActions.saveSetting(SETTINGS_KEYS.OPT_IN_VENDOR_PENDO, isChecked),
    )
    dispatch(GAActions.updateSettings())
  }

  return (
    <div>
      <div className='appsettings-modal__setting appsettings-modal__setting--crash-reports'>
        <Checkbox
          onChange={optinCrashReportsHandler}
          label={t('helpUsImproveModal.unexpectedErrors')}
          checked={optinCrashReports}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.unexpectedErrorsDesc'
            components={{
              codeRefUrl: (
                <a
                  href={METRICS_CODE_REF_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </div>
      </div>
      <div className='appsettings-modal__setting appsettings-modal__setting--crash-reports'>
        <Checkbox
          onChange={optinBFXAnalyticsHandler}
          label={t('helpUsImproveModal.anonymousData')}
          checked={optinBFXAnalytics}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.anonymousDataDesc'
            components={{
              codeRefUrl: (
                <a
                  href={UNIQUE_ID_CODE_REF_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </div>
      </div>
      <div className='appsettings-modal__setting appsettings-modal__setting--crash-reports'>
        <Checkbox
          onChange={optinVendorPendoHandler}
          label={t('helpUsImproveModal.pendoUsage')}
          checked={optinVendorPendo}
          className='appsettings-modal__checkbox'
        />
        <p className='appsettings-modal__description'>
          <Trans
            t={t}
            i18nKey='helpUsImproveModal.pendoUsageDesc'
            components={{
              pendoURL: (
                <a
                  href={PENDO_WEB_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
              pendoPP: (
                <a
                  href={PENDO_PRIVACY_POLICY_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
              codeRefUrl: (
                <a
                  href={PENDO_CODE_REF_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </p>
      </div>
    </div>
  )
}

export default memo(Analytics)
