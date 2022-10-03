import { createSelector } from 'reselect'
import _forEach from 'lodash/forEach'
import _orderBy from 'lodash/orderBy'
import _values from 'lodash/values'
import { getSavedStrategies } from '.'
import sortedByTimePastStrategies from './get_sorted_by_time_past_strategies'

const getDraftStrategies = createSelector(
  [getSavedStrategies, sortedByTimePastStrategies],
  (savedStrategies, pastStrategies) => {
    const draftStrategies = { ...savedStrategies }
    _forEach(pastStrategies, (pastStrategy) => {
      const { strategyId } = pastStrategy
      delete draftStrategies[strategyId]
    })

    const draftStrategiesArray = _values(draftStrategies)
    const sortedArray = _orderBy(draftStrategiesArray, 'savedTs', 'desc')

    return sortedArray
  },
)

export default getDraftStrategies
