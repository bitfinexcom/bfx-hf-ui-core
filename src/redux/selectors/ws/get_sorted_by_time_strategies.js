import _values from 'lodash/values'
import _orderBy from 'lodash/orderBy'
import { createSelector } from 'reselect'
import getSavedStrategies from './get_saved_strategies'

const sortedByTimeStrategies = createSelector([getSavedStrategies], (strategies) => {
  const strategiesArray = _values(strategies)
  const sortedArray = _orderBy(strategiesArray, 'savedTs', 'desc')

  return sortedArray
})

export default sortedByTimeStrategies
