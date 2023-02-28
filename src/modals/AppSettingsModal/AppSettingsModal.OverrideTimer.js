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
  DEFAULT_RECONNECTION_TIME,
  getReconnectionTime,
  MAX_RECONNECTION_TIME,
  SETTINGS_KEYS,
} from '../../redux/selectors/ui'

const maxReconnectionTimeInSec = MAX_RECONNECTION_TIME / 1000
const defaultReconnectionTimeInSec = DEFAULT_RECONNECTION_TIME / 1000
const maxReconnectionTimeInMin = maxReconnectionTimeInSec / 60

const validateInput = (v, t) => {
  const numericError = NumberInput.validateValue(v, t)

  if (numericError) {
    return numericError
  }

  if (v < DEFAULT_RECONNECTION_TIME) {
    return t('appSettings.overrideDefaultReconnectionTimerMinError', { seconds: defaultReconnectionTimeInSec })
  }

  if (v > MAX_RECONNECTION_TIME) {
    return t('appSettings.overrideDefaultReconnectionTimerMaxError', { minutes: maxReconnectionTimeInMin })
  }

  return null
}

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
  const [reconnectionTimeInputError, setReconnectionTimeInputError] = useState('')

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
    const timeInMs = nextTime * 1000
    const validationError = validateInput(timeInMs, t)

    setReconnectionTimeInput(nextTime)
    setReconnectionTimeInputError(validationError)
    if (timeInMs === reconnectionTime || validationError) {
      return
    }
    updateReconnectionTime(nextTime)
  }

  const handleOverrideDefaultReconnectionCheckbox = (isChecked) => {
    if (!isChecked) {
      onReconnectionTimeInputChange(defaultReconnectionTimeInSec)
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
        <p>
          {t('appSettings.overrideDefaultReconnectionTimerText', {
            minValue: defaultReconnectionTimeInSec,
            maxValueInMin: maxReconnectionTimeInMin,
          })}
        </p>
        <NumberInput
          className='override-reconnection-timer__input'
          value={reconnectionTimeInput}
          onChange={onReconnectionTimeInputChange}
          disabled={!isOverrideDefaultReconnectionTimeChecked}
          indicator={t('appSettings.overrideDefaultReconnectionTimerInput', {
            maxValue: maxReconnectionTimeInSec,
          })}
          max={maxReconnectionTimeInSec}
          min={defaultReconnectionTimeInSec}
          validationError={reconnectionTimeInputError}
          percentage
        />
      </div>
    </div>
  )
}

export default OverrideTimer
