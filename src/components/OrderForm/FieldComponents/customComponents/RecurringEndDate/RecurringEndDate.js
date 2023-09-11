import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react'
import PropTypes from 'prop-types'
import { add, max } from 'date-fns'
import DateInput from '../../input.date'
import { isValidDate, roundDay } from '../../../../../util/date'
import { RECURRENCE_OPTIONS } from '../../../OrderForm.helpers'

const RecurringEndDate = ({ fieldData, onFieldChange, ...props }) => {
  const {
    endless, endedAt, startedAt, recurrence,
  } = fieldData

  const [value, setValue] = useState(null)
  const minDate = useMemo(() => {
    const currentDate = new Date()

    const addDurationParams = {}
    // eslint-disable-next-line default-case
    switch (recurrence) {
      case RECURRENCE_OPTIONS.DAILY:
        addDurationParams.days = 1
        break
      case RECURRENCE_OPTIONS.WEEKLY:
        addDurationParams.weeks = 1
        break
      case RECURRENCE_OPTIONS.MONTHLY:
        addDurationParams.months = 1
        break
    }

    return max([add(startedAt || currentDate, addDurationParams), currentDate])
  }, [recurrence, startedAt])

  const resetInput = useCallback(() => {
    if (value) {
      setValue(null)
      onFieldChange('endedAt', null)
    }
  }, [onFieldChange, value])

  const handleDatePicker = useCallback(
    (date) => {
      onFieldChange('endedAt', roundDay(startedAt, date))
    },
    [onFieldChange, startedAt],
  )

  useEffect(() => {
    if (recurrence || endless || !startedAt) {
      resetInput()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endless, startedAt, recurrence])

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
    <DateInput
      {...props}
      minDate={minDate}
      value={value}
      showTimeSelect={false}
      onChange={handleDatePicker}
    />
  )
}

RecurringEndDate.propTypes = {
  fieldData: PropTypes.shape({
    endless: PropTypes.bool,
    endedAt: PropTypes.instanceOf(Date),
    startedAt: PropTypes.instanceOf(Date),
    recurrence: PropTypes.string,
  }),
  onFieldChange: PropTypes.func.isRequired,
}

RecurringEndDate.defaultProps = {
  fieldData: {
    endless: false,
    endedAt: null,
    startedAt: null,
    recurrence: null,
  },
}

export default RecurringEndDate
