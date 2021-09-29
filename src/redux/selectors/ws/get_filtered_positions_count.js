import { createSelector } from 'reselect'
import _size from 'lodash/size'

import getFilteredPositions from './get_filtered_positions'

const getFilteredPositionsCount = createSelector(
  getFilteredPositions,
  (getPositions) => (activeFilter) => _size(getPositions(activeFilter)),
)

export default getFilteredPositionsCount
