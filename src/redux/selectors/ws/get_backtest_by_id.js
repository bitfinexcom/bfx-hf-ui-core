import { createSelector } from 'reselect'
import _get from 'lodash/get'
import { getBacktestHistory } from '.'

const getBacktestById = (executionId) => createSelector([getBacktestHistory], (backtestHistory) => {
  const { backtests } = backtestHistory
  return _get(backtests, executionId, {})
})

export default getBacktestById
