import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import DateInput from '../../input.date'
import { isValidDate } from '../../../../../util/date'

const RecurringEndDate = ({ fieldData, onFieldChange, ...props }) => {
  const { endless, endDate, startDate } = fieldData

  const [value, setValue] = useState()

  const resetInput = useCallback(() => {
    setValue(null)
    onFieldChange('endDate', null)
  }, [onFieldChange])

  useEffect(() => {
    if (endless || !startDate) {
      resetInput()
    }
  }, [endless, startDate, resetInput])

  useEffect(() => {
    if (
      isValidDate(startDate)
      && isValidDate(endDate)
      && startDate.getTime() > endDate.getTime()
    ) {
      resetInput()
      return
    }
    setValue(endDate)
  }, [endDate, onFieldChange, resetInput, startDate])

  return (
    <DateInput {...props} minDate={startDate || new Date()} value={value} />
  )
}

RecurringEndDate.propTypes = {
  fieldData: PropTypes.shape({
    endless: PropTypes.bool,
    endDate: PropTypes.instanceOf(Date),
    startDate: PropTypes.instanceOf(Date),
  }),
  onFieldChange: PropTypes.func.isRequired,
}

RecurringEndDate.defaultProps = {
  fieldData: {
    endless: false,
    endDate: null,
    startDate: null,
  },
}

export default RecurringEndDate
