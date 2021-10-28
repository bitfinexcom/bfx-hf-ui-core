import _get from 'lodash/get'
import _values from 'lodash/values'
import _orderBy from 'lodash/orderBy'
import _keyBy from 'lodash/keyBy'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS
const EMPTY_OBJ = {}

const getStrategies = (state) => _get(state, `${path}.strategies`, EMPTY_OBJ)

const sortedByTimeStrategies = createSelector(getStrategies, (strategies) => {
  const strategiesArray = _values(strategies)
  const sortedArray = _orderBy(strategiesArray, 'savedTs', 'desc')
  const strategiesObject = _keyBy(sortedArray, s => s?.id)

  return strategiesObject
})

export default sortedByTimeStrategies
