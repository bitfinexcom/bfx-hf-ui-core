import React, { memo } from 'react'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import { renderString, CONVERT_LABELS_TO_PLACEHOLDERS } from './fields.helpers'
import { LANGUAGES } from '../../../locales/i18n'
import { getLocalDateFormat } from '../../../util/date'

const DateInput = ({
  value, minDate, maxDate, onChange, def, renderData, validationError,
}) => {
  const { label, minDate: MIN_DATE } = def
  const renderedLabel = renderString(label, renderData)

  const { t, i18n } = useTranslation()

  const i18nMappedKey = i18n.getMappedLanguageKey()

  return (
    <div className='hfui-orderform__input fullWidth hfui-input'>
      <DatePicker
        width='100%'
        popperPlacement='bottom-start'
        dateFormat={getLocalDateFormat(LANGUAGES[i18nMappedKey])}
        timeCaption={t('table.time')}
        timeFormat='HH:mm'
        dropdownMode='select'
        showTimeSelect
        showYearDropdown
        showMonthDropdown
        timeIntervals={10}
        selected={value}
        minDate={MIN_DATE || minDate}
        maxDate={maxDate}
        onChange={onChange}
        placeholder={CONVERT_LABELS_TO_PLACEHOLDERS ? renderedLabel : undefined}
        locale={LANGUAGES[i18nMappedKey]}
        calendarClassName='hfui-datepicker'
      />

      {!CONVERT_LABELS_TO_PLACEHOLDERS && (
        <p className='hfui-orderform__input-label'>
          {renderedLabel}
        </p>
      )}

      {validationError && (
        <p className='hfui-orderform__input-error-label'>
          {validationError}
        </p>
      )}
    </div>
  )
}

DateInput.displayName = 'DateInput'

DateInput.processValue = v => +v

DateInput.validateValue = (v, t) => {
  if (`${new Date(+v)}` === 'Invalid Date') {
    return t('orderForm.invalidDateMessage')
  } if (v === '') {
    return t('orderForm.dateRequiredMessage')
  }

  return false
}

DateInput.propTypes = {
  def: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.instanceOf(Date),
  ])),
  renderData: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string, PropTypes.number, PropTypes.bool,
  ])),
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  validationError: PropTypes.oneOfType([
    PropTypes.string, PropTypes.bool,
  ]),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
}

DateInput.defaultProps = {
  minDate: new Date('01/01/2009'),
  maxDate: null,
  renderData: {},
  validationError: '',
  value: new Date(),
  def: {},
}

export default memo(DateInput)
