import React, { memo, useMemo } from 'react'
import ReactDatePicker from 'react-datepicker'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Tooltip } from '@ufx-ui/core'
import { useSelector } from 'react-redux'

import { LANGUAGES } from '../../locales/i18n'
import { getLocalDateFormat } from '../../util/date'
import { getFormatTimeFn, getTimestampFormat } from '../../redux/selectors/ui'
import { CONVERT_LABELS_TO_PLACEHOLDERS } from '../../components/OrderForm/FieldComponents/fields.helpers'
import DatePickerPortal from './DatePicker.Portal'

import './style.css'

const DatePicker = ({
  value,
  minDate,
  maxDate,
  onChange,
  label,
  customHelp,
  validationError,
  disabled,
}) => {
  const { t, i18n } = useTranslation()
  const i18nMappedKey = i18n.getMappedLanguageKey()
  const timestampFormat = useSelector(getTimestampFormat)
    || getLocalDateFormat(LANGUAGES[i18nMappedKey])
  const formatTime = useSelector(getFormatTimeFn)

  const renderedValue = useMemo(() => {
    if (!value) {
      return ''
    }
    return formatTime(value)
  }, [value, formatTime])

  return (

    <div
      className={clsx('hfui-orderform__input fullWidth hfui-input', {
        disabled,
      })}
    >
      <ReactDatePicker
        width='100%'
        dateFormat={timestampFormat}
        timeCaption={t('table.time')}
                // timeFormat={timestampFormat}
        dropdownMode='select'
        showTimeSelect
        showYearDropdown
        showMonthDropdown
        timeIntervals={30}
        selected={value}
        minDate={minDate}
        maxDate={maxDate}
        onChange={onChange}
        placeholder={CONVERT_LABELS_TO_PLACEHOLDERS ? label : undefined}
        locale={LANGUAGES[i18nMappedKey]}
        disabled={disabled}
        popperContainer={DatePickerPortal}
      />
      {!CONVERT_LABELS_TO_PLACEHOLDERS && (
      <p className='hfui-orderform__input-label'>
        {renderedValue}
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
