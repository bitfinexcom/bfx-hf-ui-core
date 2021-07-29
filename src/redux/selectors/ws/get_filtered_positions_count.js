import { createSelector } from 'reselect'

import getFilteredPositions from './get_filtered_positions'

const getFilteredPositionsCount = createSelector(
  getFilteredPositions,
  (getPositions) => (activeFilter) => getPositions(activeFilter)?.length,
)

export default getFilteredPositionsCount
