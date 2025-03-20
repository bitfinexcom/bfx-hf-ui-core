import React, { memo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import WSActions from '../../redux/actions/ws'
import {
  isDevEnv,
  getAutoLoginState,
  updateAutoLoginState,
} from '../../util/autologin'
import {
  SETTINGS_KEYS,
  getShowAlgoPauseInfoSetting,
  getIsAutoResumeAOs,
} from '../../redux/selectors/ui'
import AttentionBar from '../../ui/AttentionBar/AttentionBar'

const INITIAL_AUTO_LOGIN = getAutoLoginState()

const General = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const settingsShowAlgoPauseInfo = useSelector(getShowAlgoPauseInfoSetting)
  const isAutoResumeAOs = useSelector(getIsAutoResumeAOs)

  const [isAutoLoginChecked, setIsAutoLoginChecked] = useState(INITIAL_AUTO_LOGIN)
  const [isShowAlgoPauseInfoChecked, setIsShowAlgoPauseInfoChecked] = useState(
    settingsShowAlgoPauseInfo,
  )
  const [isAutoResumeAOsChecked, setIsAutoResumeAOsChecked] = useState(isAutoResumeAOs)

  useEffect(() => {
    setIsShowAlgoPauseInfoChecked(settingsShowAlgoPauseInfo)
  }, [settingsShowAlgoPauseInfo])

  const updateAOPause = (nextAOPause) => {
    setIsShowAlgoPauseInfoChecked(nextAOPause)
    dispatch(
      WSActions.saveSetting(SETTINGS_KEYS.SHOW_ALGO_PAUSE_INFO, nextAOPause),
    )
  }

  const updateAutoResumeAOs = (nextAutoResumeAOs) => {
    setIsAutoResumeAOsChecked(nextAutoResumeAOs)
    dispatch(
      WSActions.saveSetting(SETTINGS_KEYS.AUTO_RESUME_AOS, nextAutoResumeAOs),
    )
  }

  return (
    <div>
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
