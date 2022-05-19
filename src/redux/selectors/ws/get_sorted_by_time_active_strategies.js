import _get from 'lodash/get'
import _values from 'lodash/values'
import _orderBy from 'lodash/orderBy'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS
const EMPTY_OBJ = {}

const getStrategies = (state) => _get(state, `${path}.execution.activeStrategies`, EMPTY_OBJ)

const sortedByTimeActiveStrategies = createSelector(getStrategies, (strategies) => {
  const strategiesArray = _values(strategies)
  const sortedArray = _orderBy(strategiesArray, 'startedOn', 'desc')

  return sortedArray
})

export default sortedByTimeActiveStrategies
