import { createSelector } from 'reselect'
import { getStrategyExecutionId } from '../ui'
import getLiveExecutionResults from './get_live_execution_results'

const getCurrentStrategyOpenPositions = createSelector([
  getLiveExecutionResults,
  getStrategyExecutionId,
], (executionResults, executionId) => {
  const results = executionResults[executionId] || {}

  const { openPositions = {} } = results?.strategy || {}
  return openPositions
})

export default getCurrentStrategyOpenPositions
