import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import {
  SETTINGS_KEYS, getOptinCrashReports, getOptinBFXAnalytics, getOptinVendorPendo,
} from '../../redux/selectors/ui'
// import InnerModal from '../../ui/InnerModal/InnerModal'

const Analytics = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const optinCrashReports = useSelector(getOptinCrashReports)
  const optinBFXAnalytics = useSelector(getOptinBFXAnalytics)
  const optinVendorPendo = useSelector(getOptinVendorPendo)

  const optinCrashReportsHandler = (isChecked) => {
    dispatch(WSActions.saveSetting(SETTINGS_KEYS.OPT_IN_CRASH_REPORTS, isChecked))
    dispatch(GAActions.updateSettings())
  }

  const optinBFXAnalyticsHandler = (isChecked) => {
    dispatch(WSActions.saveSetting(SETTINGS_KEYS.OPT_IN_BFX_ANALYTICS, isChecked))
    dispatch(GAActions.updateSettings())
  }

  const optinVendorPendoHandler = (isChecked) => {
    dispatch(WSActions.saveSetting(SETTINGS_KEYS.OPT_IN_VENDOR_PENDO, isChecked))
    dispatch(GAActions.updateSettings())
  }

  return (
    <div>
      <div className='appsettings-modal__setting appsettings-modal__setting--crash-reports'>
        <Checkbox
          onChange={optinCrashReportsHandler}
          label={t('appSettings.optinCrashReports')}
          checked={optinCrashReports}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          {t('appSettings.optinCrashReportsDesc')}
        </div>
      </div>
      <div className='appsettings-modal__setting appsettings-modal__setting--crash-reports'>
        <Checkbox
          onChange={optinBFXAnalyticsHandler}
          label={t('appSettings.optinCrashReports')}
          checked={optinBFXAnalytics}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          {t('appSettings.optinCrashReportsDesc')}
        </div>
      </div>
      <div className='appsettings-modal__setting appsettings-modal__setting--crash-reports'>
        <Checkbox
          onChange={optinVendorPendoHandler}
          label={t('appSettings.optinVendorPendo')}
          checked={optinVendorPendo}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          {t('appSettings.optinVendorPendoDesc')}
        </div>
      </div>
    </div>
  )
}

export default memo(Analytics)
