import React, { memo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '@ufx-ui/core'

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
        General
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={updateDms}
          label='Dead Man Switch'
          checked={isDmsChecked}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          <p>
            Enabling the Dead Man switch will automatically cancel all
            active orders when the application closes.
          </p>
          <p>
            Algorithmic orders are cancelled on application close;
            without the Dead Man switch, any atomic orders created by an
            AO will remain open, and state may be lost when the
            application is started up again.
          </p>
          <div className='appsettings-modal__warning'>
            Disabling this should be done with caution!
          </div>
        </div>
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={updateGa}
          label='Usage reporting'
          checked={isGaChecked}
          className='appsettings-modal__checkbox'
        />
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={updateAOPause}
          label='Show Algo Orders pause info'
          checked={isShowAlgoPauseInfoChecked}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          If checked, the modal with explanations will be displayed when you close the app with active Algo Orders.
        </div>
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={updateReboot}
          label='Reboot automatically on bad connection'
          checked={isRebootChecked}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          When you experience a poor internet connection, the modal window that notifies you of this will not be displayed and the app will restart automatically.
        </div>
      </div>
      {isDevEnv() && (
        <div className='appsettings-modal__setting'>
          <Checkbox
            label='Auto-login in development mode'
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
