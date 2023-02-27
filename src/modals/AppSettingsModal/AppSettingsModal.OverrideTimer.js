import React, { useMemo, useState } from 'react'
// import PropTypes from 'prop-types'
import _debounce from 'lodash/debounce'
import { Checkbox } from '@ufx-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import NumberInput from '../../components/OrderForm/FieldComponents/input.number'
import {
  DEFAULT_RECONNECTION_TIME, getReconnectionTime, MAX_RECONNECTION_TIME_SEC, SETTINGS_KEYS,
} from '../../redux/selectors/ui'

const OverrideTimer = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const reconnectionTime = useSelector(getReconnectionTime)

  const [reconnectionTimeInput, setReconnectionTimeInput] = useState(
    reconnectionTime / 1000,
  )
  const [
    isOverrideDefaultReconnectionTimeChecked,
    setOverrideDefaultReconnectionTimeChecked,
  ] = useState(reconnectionTime !== DEFAULT_RECONNECTION_TIME)

  const updateReconnectionTime = useMemo(
    () => _debounce((value) => {
      const timeInMs = value * 1000
      dispatch(
        WSActions.saveSettings(SETTINGS_KEYS.PACKET_WD_DELAY, timeInMs),
      )
      dispatch(GAActions.updateSettings())
    }, 1000),
    [dispatch],
  )

  const onReconnectionTimeInputChange = (nextTime) => {
    setReconnectionTimeInput(nextTime)
    if (nextTime * 1000 === reconnectionTime) {
      return
    }
    updateReconnectionTime(nextTime)
  }

  const handleOverrideDefaultReconnectionCheckbox = (isChecked) => {
    if (!isChecked) {
      onReconnectionTimeInputChange(DEFAULT_RECONNECTION_TIME / 1000)
    }
    setOverrideDefaultReconnectionTimeChecked(isChecked)
  }

  return (
    <div className='appsettings-modal__setting'>
      <Checkbox
        onChange={handleOverrideDefaultReconnectionCheckbox}
        label={t('appSettings.overrideDefaultReconnectionTimerCheckbox')}
        checked={isOverrideDefaultReconnectionTimeChecked}
        className='appsettings-modal__checkbox'
      />
      <div className='appsettings-modal__description'>
        <p>{t('appSettings.overrideDefaultReconnectionTimerText')}</p>
        <NumberInput
          className='override-reconnection-timer__input'
          value={reconnectionTimeInput}
          onChange={onReconnectionTimeInputChange}
          disabled={!isOverrideDefaultReconnectionTimeChecked}
          indicator={t('appSettings.overrideDefaultReconnectionTimerInput', {
            maxValue: MAX_RECONNECTION_TIME_SEC,
          })}
          max={MAX_RECONNECTION_TIME_SEC}
          // validationError={{}}
        />
      </div>
    </div>
  )
}

export default OverrideTimer
