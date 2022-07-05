import React, { memo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Checkbox } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import { changeConfirmDMSModalState } from '../../redux/actions/ui'
import {
  isDevEnv,
  getAutoLoginState,
  updateAutoLoginState,
} from '../../util/autologin'
import {
  SETTINGS_KEYS,
  getDMSSetting,
  getGASetting,
  getShowAlgoPauseInfoSetting,
  getIsBetaVersion,
} from '../../redux/selectors/ui'
import { DONT_SHOW_DMS_MODAL_KEY } from '../../constants/variables'
import InnerModal from '../../ui/InnerModal/InnerModal'
import { isElectronApp } from '../../redux/config'

const INITIAL_AUTO_LOGIN = getAutoLoginState()

const General = () => {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false)

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const settingsDms = useSelector(getDMSSetting)
  const settingsGa = useSelector(getGASetting)
  const settingsShowAlgoPauseInfo = useSelector(getShowAlgoPauseInfoSetting)
  const isBetaVersion = useSelector(getIsBetaVersion)

  const [isAutoLoginChecked, setIsAutoLoginChecked] = useState(INITIAL_AUTO_LOGIN)
  const [isDmsChecked, setIsDmsChecked] = useState(settingsDms)
  const [isGaChecked, setIsGaChecked] = useState(settingsGa)
  const [isShowAlgoPauseInfoChecked, setIsShowAlgoPauseInfoChecked] = useState(settingsShowAlgoPauseInfo)

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
    const dontShowDMSModal = localStorage.getItem(DONT_SHOW_DMS_MODAL_KEY)

    if (nextDms === true && dontShowDMSModal !== 'true') {
      dispatch(changeConfirmDMSModalState(true))
    } else {
      setIsDmsChecked(nextDms)
      dispatch(WSActions.saveSettings(SETTINGS_KEYS.DMS, nextDms))
      dispatch(GAActions.updateSettings())
    }
  }

  const updateGa = (nextGa) => {
    setIsGaChecked(nextGa)
    dispatch(WSActions.saveSettings(SETTINGS_KEYS.GA, nextGa))
    dispatch(GAActions.updateSettings())
  }

  const updateAOPause = (nextAOPause) => {
    setIsShowAlgoPauseInfoChecked(nextAOPause)
    dispatch(
      WSActions.saveSettings(SETTINGS_KEYS.SHOW_ALGO_PAUSE_INFO, nextAOPause),
    )
    dispatch(GAActions.updateSettings())
  }

  const closeBetaModal = () => setIsBetaModalOpen(false)

  const openBetaModal = () => setIsBetaModalOpen(true)

  const onBetaCheckboxClickHandler = (isChecked) => {
    if (isChecked) {
      openBetaModal()
      return
    }
    dispatch(WSActions.saveSettings(SETTINGS_KEYS.JOIN_BETA_PROGRAM, false))
    dispatch(GAActions.updateSettings())
  }

  const updateBetaProgram = (e) => {
    e.stopPropagation()
    dispatch(WSActions.saveSettings(SETTINGS_KEYS.JOIN_BETA_PROGRAM, true))
    dispatch(GAActions.updateSettings())
    closeBetaModal()
  }

  return (
    <div>
      <div className='appsettings-modal__title'>
        {t('appSettings.generalTab')}
      </div>
      {isElectronApp && (
        <div className='appsettings-modal__setting appsettings-modal__setting--beta'>
          <Checkbox
            onChange={onBetaCheckboxClickHandler}
            label={t('appSettings.betaProgramCheckbox')}
            checked={isBetaVersion}
            className='appsettings-modal__checkbox'
          />
          <div className='appsettings-modal__description'>
            {t('appSettings.betaProgramText')}
          </div>
          {isBetaModalOpen && (
            <InnerModal
              title={(
                <span className='beta-modal__title'>
                  {t('appSettings.betaModalTitle')}
                </span>
              )}
              onClose={closeBetaModal}
              className='beta-modal'
            >
              <div>
                <div className='beta-modal__content'>{t('appSettings.betaDesclaimer')}</div>
                <Button
                  onClick={updateBetaProgram}
                  className='beta-modal__button'
                >
                  {t('appSettings.betaProgramCheckbox')}
                </Button>
              </div>
            </InnerModal>
          )}
        </div>
      )}

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
