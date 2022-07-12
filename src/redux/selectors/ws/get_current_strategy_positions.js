import { createSelector } from 'reselect'
import { getStrategyExecutionId } from '../ui'
import getLiveExecutionResults from './get_live_execution_results'

const getCurrentStrategyPositions = createSelector([
  getLiveExecutionResults,
  getStrategyExecutionId,
], (executionResults, executionId) => {
  const results = executionResults[executionId] || {}

  const { closedPositions = {}, openPositions = {} } = results?.strategy || {}
  const positions = { ...closedPositions, ...openPositions }
  return positions
})

export default getCurrentStrategyPositions
