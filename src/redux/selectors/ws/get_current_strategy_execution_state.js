import { createSelector } from 'reselect'
import _isEmpty from 'lodash/isEmpty'
import {
  getIsExecutionLoading,
  getLiveExecutionResults,
} from '.'
import { getStrategyExecutionId } from '../ui'
import getActiveStrategies from './get_active_strategies'

const getCurrentStrategyExecutionState = createSelector(
  [
    getIsExecutionLoading,
    getLiveExecutionResults,
    getActiveStrategies,
    getStrategyExecutionId,
  ],
  (loading, executionResults, activeStrategies, executionId) => {
    const results = executionResults[executionId] || {}

    return {
      loading: _isEmpty(results) ? false : loading,
      executing: Boolean(executionId && activeStrategies[executionId]),
      results,
      startedOn: activeStrategies?.[executionId]?.startedOn || null,
    }
  },
)

export default getCurrentStrategyExecutionState
