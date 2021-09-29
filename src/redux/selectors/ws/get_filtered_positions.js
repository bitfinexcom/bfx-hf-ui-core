import _isEmpty from 'lodash/isEmpty'
import _reduce from 'lodash/reduce'
import { createSelector } from 'reselect'
import memoizeOne from 'memoize-one'

import getAllPositions from './get_all_positions'

const getFilteredPositions = createSelector(
  getAllPositions,
  (positions) => memoizeOne(activeFilter => {
    if (_isEmpty(activeFilter)) {
      return positions
    }

    return _reduce(positions, (acc, p) => {
      if (p?.symbol === activeFilter?.wsID) {
        acc[p?.id] = p
      }
      return acc
    }, {})
  }),
)

export default getFilteredPositions
