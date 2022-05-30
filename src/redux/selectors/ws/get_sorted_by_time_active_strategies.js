import _values from 'lodash/values'
import _orderBy from 'lodash/orderBy'
import { createSelector } from 'reselect'
import getActiveStrategies from './get_active_strategies'

const sortedByTimeActiveStrategies = createSelector(
  [getActiveStrategies],
  (strategies) => {
    const strategiesArray = _values(strategies)
    const sortedArray = _orderBy(strategiesArray, 'startedOn', 'desc')

    return sortedArray
  },
)

export default sortedByTimeActiveStrategies
