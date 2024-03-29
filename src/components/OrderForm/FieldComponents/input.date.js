import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { renderString } from './fields.helpers'

import DatePicker from '../../../ui/DatePicker/DatePicker'

const DateInput = ({
  value,
  minDate,
  maxDate,
  onChange,
  def,
  renderData,
  validationError,
  disabled,
  showTimeSelect,
}) => {
  const { label, minDate: MIN_DATE, customHelp } = def
  const renderedLabel = renderString(label, renderData)

  return (
    <DatePicker
      value={value}
      minDate={minDate || MIN_DATE}
      maxDate={maxDate}
      onChange={onChange}
      label={renderedLabel}
      customHelp={customHelp}
      validationError={validationError}
      disabled={disabled}
      showTimeSelect={showTimeSelect}
    />
  )
}

DateInput.propTypes = {
  def: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.instanceOf(Date),
      PropTypes.object,
    ]),
  ),
  renderData: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ),
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  validationError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  disabled: PropTypes.bool,
  showTimeSelect: PropTypes.bool,
}

DateInput.defaultProps = {
  minDate: null,
  maxDate: null,
  renderData: {},
  validationError: '',
  value: null,
  def: {},
  disabled: false,
  showTimeSelect: true,
}

export default memo(DateInput)
