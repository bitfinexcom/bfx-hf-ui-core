import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { getDateInShortFormat, getWeekDayString } from '../../../../../util/date'

import './style.css'

const RECCURENCE_OPTIONS = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
}

const RecurringAOSummary = ({ fieldData }) => {
  const { t } = useTranslation()
  const { recurrence, startDate, endDate } = fieldData

  const recurranceString = useMemo(() => {
    if (recurrence === RECCURENCE_OPTIONS.DAILY) {
      return t('algoOrderForm.recurring.day')
    }
    if (recurrence === RECCURENCE_OPTIONS.WEEKLY) {
      const weekday = getWeekDayString(startDate || new Date())
      return t('algoOrderForm.recurring.weekOn', { weekday })
    }
    if (recurrence === RECCURENCE_OPTIONS.MONTHLY) {
      const day = getDateInShortFormat(startDate)
      return t('algoOrderForm.recurring.monthOn', { day })
    }

    return null
  }, [recurrence, startDate, t])

  const message = t('algoOrderForm.recurring.summary', {
    recurrence: recurranceString,
    startTime: startDate
      ? t('algoOrderForm.recurring.startOn', {
        dateTime: startDate.toLocaleString(),
      })
      : t('algoOrderForm.recurring.startNow'),
    endTime: endDate
      ? endDate.toLocaleString()
      : t('algoOrderForm.recurring.manuallyStop'),
  })
  return <div className='hfui-recurring-ao-message'>{message}</div>
}

RecurringAOSummary.propTypes = {
  fieldData: PropTypes.shape({
    recurrence: PropTypes.string,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  }),
}

RecurringAOSummary.defaultProps = {
  fieldData: {
    recurrence: null,
    startDate: null,
    endDate: null,
  },
}
export default RecurringAOSummary
