import React, { memo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import { changeUIModalState } from '../../redux/actions/ui'
import {
  isDevEnv,
  getAutoLoginState,
  updateAutoLoginState,
} from '../../util/autologin'
import {
  SETTINGS_KEYS,
  getDMSSetting,
  getShowAlgoPauseInfoSetting,
  getIsAutoResumeAOs,
} from '../../redux/selectors/ui'
import { DONT_SHOW_DMS_MODAL_KEY } from '../../constants/variables'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import AttentionBar from '../../ui/AttentionBar/AttentionBar'
// import OverrideTimer from './AppSettingsModal.OverrideTimer'

const INITIAL_AUTO_LOGIN = getAutoLoginState()

const General = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const settingsDms = useSelector(getDMSSetting)
  const settingsShowAlgoPauseInfo = useSelector(getShowAlgoPauseInfoSetting)
  const isAutoResumeAOs = useSelector(getIsAutoResumeAOs)

  const [isAutoLoginChecked, setIsAutoLoginChecked] = useState(INITIAL_AUTO_LOGIN)
  const [isDmsChecked, setIsDmsChecked] = useState(settingsDms)
  const [isShowAlgoPauseInfoChecked, setIsShowAlgoPauseInfoChecked] = useState(
    settingsShowAlgoPauseInfo,
  )
  const [isAutoResumeAOsChecked, setIsAutoResumeAOsChecked] = useState(isAutoResumeAOs)

  useEffect(() => {
    setIsDmsChecked(settingsDms)
  }, [settingsDms])

  useEffect(() => {
    setIsShowAlgoPauseInfoChecked(settingsShowAlgoPauseInfo)
  }, [settingsShowAlgoPauseInfo])

  const updateDms = (nextDms) => {
    const dontShowDMSModal = localStorage.getItem(DONT_SHOW_DMS_MODAL_KEY)

    if (nextDms === true && dontShowDMSModal !== 'true') {
      dispatch(changeUIModalState(UI_MODAL_KEYS.CONFIRM_DMS_MODAL, true))
    } else {
      setIsDmsChecked(nextDms)
      dispatch(WSActions.saveSettings(SETTINGS_KEYS.DMS, nextDms))
      dispatch(GAActions.updateSettings())
    }
  }

  const updateAOPause = (nextAOPause) => {
    setIsShowAlgoPauseInfoChecked(nextAOPause)
    dispatch(
      WSActions.saveSettings(SETTINGS_KEYS.SHOW_ALGO_PAUSE_INFO, nextAOPause),
    )
    dispatch(GAActions.updateSettings())
  }

  const updateAutoResumeAOs = (nextAutoResumeAOs) => {
    setIsAutoResumeAOsChecked(nextAutoResumeAOs)
    dispatch(
      WSActions.saveSettings(SETTINGS_KEYS.AUTO_RESUME_AOS, nextAutoResumeAOs),
    )
    dispatch(GAActions.updateSettings())
  }

  return (
    <div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={updateDms}
          label={t('appSettings.deadManCheckbox')}
          checked={isDmsChecked}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          <AttentionBar red>{t('appSettings.deadManWarning')}</AttentionBar>
          <p>{t('appSettings.deadManText1')}</p>
          <p>{t('appSettings.deadManText2')}</p>
        </div>
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
      {/* <OverrideTimer /> */}
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={updateAutoResumeAOs}
          label={t('appSettings.autoResumeAOsCheckbox')}
          checked={isAutoResumeAOsChecked}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          <AttentionBar red>
            {t('appSettings.autoResumeAOsWarning')}
          </AttentionBar>
          <p>{t('appSettings.autoResumeAOsText')}</p>
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
