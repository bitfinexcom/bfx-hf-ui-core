import React, { memo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import { getActiveAlgoOrders } from '../../redux/actions/ao'
import {
  isDevEnv,
  getAutoLoginState,
  updateAutoLoginState,
} from '../../util/autologin'
import {
  SETTINGS, getDMSSetting, getGASetting, getShowAlgoPauseInfoSetting, getRebootSetting,
} from '../../redux/selectors/ui'

const INITIAL_AUTO_LOGIN = getAutoLoginState()

const General = () => {
  const dispatch = useDispatch()
  const settingsDms = useSelector(getDMSSetting)
  const settingsGa = useSelector(getGASetting)
  const settingsShowAlgoPauseInfo = useSelector(getShowAlgoPauseInfoSetting)
  const settingsRebootAutomatically = useSelector(getRebootSetting)

  const [isAutoLoginChecked, setIsAutoLoginChecked] = useState(INITIAL_AUTO_LOGIN)
  const [isDmsChecked, setIsDmsChecked] = useState(settingsDms)
  const [isGaChecked, setIsGaChecked] = useState(settingsGa)
  const [isRebootChecked, setIsRebootChecked] = useState(settingsRebootAutomatically)
  const [isShowAlgoPauseInfoChecked, setIsShowAlgoPauseInfoChecked] = useState(settingsShowAlgoPauseInfo)

  const { t } = useTranslation()

  useEffect(() => {
    setIsDmsChecked(settingsDms)
  }, [settingsDms])

  useEffect(() => {
    setIsGaChecked(settingsGa)
  }, [settingsGa])

  useEffect(() => {
    setIsShowAlgoPauseInfoChecked(settingsShowAlgoPauseInfo)
  }, [settingsShowAlgoPauseInfo])

  const updateDms = (nextDms) => {
    setIsDmsChecked(nextDms)
    dispatch(WSActions.saveSettings(SETTINGS.DMS, nextDms))
    dispatch(getActiveAlgoOrders())
    dispatch(GAActions.updateSettings())
  }

  const updateGa = (nextGa) => {
    setIsGaChecked(nextGa)
    dispatch(WSActions.saveSettings(SETTINGS.GA, nextGa))
    dispatch(GAActions.updateSettings())
  }

  const updateAOPause = (nextAOPause) => {
    setIsShowAlgoPauseInfoChecked(nextAOPause)
    dispatch(WSActions.saveSettings(SETTINGS.SHOW_ALGO_PAUSE_INFO, nextAOPause))
    dispatch(GAActions.updateSettings())
  }

  const updateReboot = (nextReboot) => {
    setIsRebootChecked(nextReboot)
    dispatch(WSActions.saveSettings(SETTINGS.REBOOT_AUTOMATICALLY, nextReboot))
    dispatch(GAActions.updateSettings())
  }

  return (
    <div>
      <div className='appsettings-modal__title'>
        {t('appSettings.generalTab')}
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={updateDms}
          label={t('appSettings.deadManCheckbox')}
          checked={isDmsChecked}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          <p>
            {t('appSettings.deadManText1')}
          </p>
          <p>
            {t('appSettings.deadManText2')}
          </p>
          <div className='appsettings-modal__warning'>
            {t('appSettings.deadManWarning')}
          </div>
        </div>
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={updateGa}
          label={t('appSettings.usageReportingCheckbox')}
          checked={isGaChecked}
          className='appsettings-modal__checkbox'
        />
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={updateAOPause}
          label={t('appSettings.showPauseInfoCheckbox')}
          checked={isShowAlgoPauseInfoChecked}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          {t('appSettings.showPauseInfoText')}
        </div>
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={updateReboot}
          label={t('appSettings.rebootCheckbox')}
          checked={isRebootChecked}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          {t('appSettings.rebootText')}
        </div>
      </div>
      {isDevEnv() && (
        <div className='appsettings-modal__setting'>
          <Checkbox
            label={t('appSettings.autologin')}
            checked={isAutoLoginChecked}
            onChange={(value) => {
              setIsAutoLoginChecked(value)
              updateAutoLoginState(value)
            }}
            className='appsettings-modal__checkbox'
          />
        </div>
      )}
    </div>
  )
}

export default memo(General)
