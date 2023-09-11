import React, { memo, useCallback, useMemo } from 'react'
import ReactDatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import _includes from 'lodash/includes'

import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Tooltip } from '@ufx-ui/core'
import { useSelector } from 'react-redux'
import { endOfDay, isSameDay, startOfDay } from 'date-fns'

import { LANGUAGES } from '../../locales/i18n'
import { getLocalDateFormat, isValidDate } from '../../util/date'
import { getTimestampFormat } from '../../redux/selectors/ui'
import { CONVERT_LABELS_TO_PLACEHOLDERS } from '../../components/OrderForm/FieldComponents/fields.helpers'
import DatePickerPortal from './DatePicker.Portal'

import './style.css'

const getTimeFormat = (dateFormat) => {
  if (_includes(dateFormat, 'H')) {
    return 'HH:mm'
  }
  return 'h:mm aa'
}

const calculateMinMaxTime = ({ date, minDate, maxDate }) => {
  if (!minDate) {
    return {}
  }

  const isSameDayAsMinDate = !date || isSameDay(date, minDate)
  if (isSameDayAsMinDate) {
    return {
      minTime: minDate,
      maxTime: endOfDay(minDate),
    }
  }
  const isSameDayAsMaxDate = maxDate && isSameDay(date, maxDate)
  if (isSameDayAsMaxDate) {
    return {
      minTime: startOfDay(maxDate),
      maxTime: maxDate,
    }
  }
  return {}
}

const DatePicker = ({
  value,
  minDate,
  maxDate,
  onChange,
  label,
  customHelp,
  validationError,
  disabled,
  ...props
}) => {
  const { t, i18n } = useTranslation()
  const i18nMappedKey = i18n.getMappedLanguageKey()
  const timestampFormat = useSelector(getTimestampFormat)
    || getLocalDateFormat(LANGUAGES[i18nMappedKey])

  const handleDatePickerChange = useCallback(
    (date) => {
      if (!date || !isValidDate(date)) {
        onChange(null)
        return
      }
      const selectedDateMts = date.getTime()
      const minDateMts = minDate?.getTime()
      const maxDateMts = maxDate?.getTime()

      let resultDate = date

      if (selectedDateMts < minDateMts) {
        resultDate = minDate
      }
      if (selectedDateMts > maxDateMts) {
        resultDate = maxDate
      }

      onChange(resultDate)
    },
    [onChange, minDate, maxDate],
  )

  const { minTime, maxTime } = useMemo(
    () => calculateMinMaxTime({
      date: value && new Date(value),
      minDate,
      maxDate,
    }),
    [value, minDate, maxDate],
  )

  const timeFormat = useMemo(() => getTimeFormat(timestampFormat), [timestampFormat])

  return (
    <div
      className={clsx('hfui-orderform__input fullWidth hfui-input', {
        disabled,
        invalid: !!validationError,
      })}
    >
      <ReactDatePicker
        width='100%'
        dateFormat={timestampFormat}
        timeCaption={t('table.time')}
        timeFormat={timeFormat}
        dropdownMode='scroll'
        showTimeSelect
        timeIntervals={15}
        selected={value}
        minDate={minDate}
        minTime={minTime}
        maxDate={maxDate}
        maxTime={maxTime}
        onChange={handleDatePickerChange}
        placeholder={CONVERT_LABELS_TO_PLACEHOLDERS ? label : undefined}
        locale={LANGUAGES[i18nMappedKey]}
        disabled={disabled}
        popperContainer={DatePickerPortal}
        {...props}
      />
      {!CONVERT_LABELS_TO_PLACEHOLDERS && (
        <p className='hfui-orderform__input-label'>
          {label}
          {customHelp && (
            <Tooltip
              className='__react-tooltip __react_component_tooltip'
              content={customHelp}
            >
              <i className='fa fa-info-circle' />
            </Tooltip>
          )}
        </p>
      )}

      {validationError && (
        <p className='hfui-orderform__input-error-label'>{validationError}</p>
      )}
    </div>
  )
}

DatePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  validationError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  disabled: PropTypes.bool,
  customHelp: PropTypes.string,
}

DatePicker.defaultProps = {
  minDate: new Date('01/01/2009'),
  maxDate: null,
  validationError: '',
  value: null,
  disabled: false,
  label: '',
  customHelp: null,
}

export default memo(DatePicker)
