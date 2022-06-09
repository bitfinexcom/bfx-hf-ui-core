import _values from 'lodash/values'
import _orderBy from 'lodash/orderBy'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import { getLiveExecutionResults, getActiveStrategies } from './index'

const getSortedByTimeActiveStrategies = () => createSelector(
  [getActiveStrategies, getLiveExecutionResults],
  (strategies, executionResults) => {
    const strategiesArray = _values(strategies)
    const sortedArray = _orderBy(strategiesArray, 'startedOn', 'desc')
    const arrayWithResults = _map(sortedArray, (strategy) => {
      const results = executionResults[strategy.id]
      return { ...strategy, results }
    })
    return arrayWithResults
  },
)

export default getSortedByTimeActiveStrategies
