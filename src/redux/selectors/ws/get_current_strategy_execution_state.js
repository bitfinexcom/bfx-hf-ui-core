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
    const { closedPositions = {}, openPositions = {} } = results?.strategy || {}
    const positions = { ...closedPositions, ...openPositions }

    return {
      ...loadingState,
      executing: Boolean(executionId && activeStrategies[executionId]),
      results,
      positions,
      startedOn: activeStrategies?.[executionId]?.startedOn || null,
    }
  },
)

export default getCurrentStrategyExecutionState
