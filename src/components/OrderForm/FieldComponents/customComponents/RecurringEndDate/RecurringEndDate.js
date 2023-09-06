import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react'
import PropTypes from 'prop-types'
import { add } from 'date-fns'
import DateInput from '../../input.date'
import { isValidDate } from '../../../../../util/date'
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

    return add(startedAt || currentDate, addDurationParams)
  }, [recurrence, startedAt])

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endless, startedAt])

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

  return <DateInput {...props} minDate={minDate} value={value} />
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
