import { createSelector } from 'reselect'
import { getIsExecutionLoading, getLiveExecutionResults } from '.'
import { getStrategyExecutionId } from '../ui'
import getActiveStrategies from './get_active_strategies'

const getCurrentStrategyExecutionState = createSelector(
  [
    getIsExecutionLoading,
    getLiveExecutionResults,
    getActiveStrategies,
    getStrategyExecutionId,
  ],
  (loadingState, executionResults, activeStrategies, executionId) => {
    const results = executionResults[executionId] || {}

    return {
      ...loadingState,
      executing: Boolean(executionId && activeStrategies[executionId]),
      results,
      startedOn: activeStrategies?.[executionId]?.startedOn || null,
    }
  },
)

export default getCurrentStrategyExecutionState
