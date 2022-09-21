import _get from 'lodash/get'
import _values from 'lodash/values'
import _orderBy from 'lodash/orderBy'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS
const EMPTY_OBJ = {}

const getStrategies = (state) => _get(state, `${path}.execution.pastStrategies`, EMPTY_OBJ)

const sortedByTimePastStrategies = createSelector(getStrategies, (strategies) => {
  const strategiesArray = _values(strategies)
  const sortedArray = _orderBy(strategiesArray, 'stoppedOn', 'desc')

  return sortedArray
})

export default sortedByTimePastStrategies
