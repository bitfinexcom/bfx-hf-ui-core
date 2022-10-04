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
} from '../../redux/selectors/ui'
import { DONT_SHOW_DMS_MODAL_KEY } from '../../constants/variables'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import AttentionBar from '../../ui/AttentionBar/AttentionBar'

const INITIAL_AUTO_LOGIN = getAutoLoginState()

const General = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const settingsDms = useSelector(getDMSSetting)
  const settingsShowAlgoPauseInfo = useSelector(getShowAlgoPauseInfoSetting)

  const [isAutoLoginChecked, setIsAutoLoginChecked] = useState(INITIAL_AUTO_LOGIN)
  const [isDmsChecked, setIsDmsChecked] = useState(settingsDms)
  const [isShowAlgoPauseInfoChecked, setIsShowAlgoPauseInfoChecked] = useState(
    settingsShowAlgoPauseInfo,
  )

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
          <p>{t('appSettings.deadManText1')}</p>
          <p>{t('appSettings.deadManText2')}</p>
          <AttentionBar red>{t('appSettings.deadManWarning')}</AttentionBar>
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
