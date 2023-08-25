import { createSelector } from 'reselect'
import _get from 'lodash/get'
import { getBacktestHistory } from '.'

const getCurrentHistoryBacktest = createSelector([getBacktestHistory], (backtestHistory) => {
  const { backtests, backtestId } = backtestHistory
  return _get(backtests, backtestId, {})
})

export default getCurrentHistoryBacktest
