import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import DateInput from '../../input.date'
import { isValidDate } from '../../../../../util/date'

const RecurringEndDate = ({ fieldData, onFieldChange, ...props }) => {
  const { endless, endedAt, startedAt } = fieldData

  const [value, setValue] = useState(null)

  const resetInput = useCallback(() => {
    if (value) {
      setValue(null)
      onFieldChange('endedAt', null)
    }
  }, [onFieldChange, value])

  useEffect(() => {
    if (endless || !startedAt) {
      resetInput()
    }
  }, [endless, startedAt, resetInput])

  useEffect(() => {
    if (
      isValidDate(startedAt)
      && isValidDate(endedAt)
      && startedAt.getTime() > endedAt.getTime()
    ) {
      resetInput()
      return
    }
    setValue(endedAt)
  }, [endedAt, onFieldChange, resetInput, startedAt])

  return (
    <DateInput {...props} minDate={startedAt || new Date()} value={value} />
  )
}

RecurringEndDate.propTypes = {
  fieldData: PropTypes.shape({
    endless: PropTypes.bool,
    endedAt: PropTypes.instanceOf(Date),
    startedAt: PropTypes.instanceOf(Date),
  }),
  onFieldChange: PropTypes.func.isRequired,
}

RecurringEndDate.defaultProps = {
  fieldData: {
    endless: false,
    endedAt: null,
    startedAt: null,
  },
}

export default RecurringEndDate
