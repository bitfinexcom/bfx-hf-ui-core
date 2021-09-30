import _isEmpty from 'lodash/isEmpty'
import _reduce from 'lodash/reduce'
import { createSelector } from 'reselect'

import getAllBalances from './get_all_balances'
import { getKey } from '../../reducers/ws/balances'

const getFilteredBalances = createSelector(
  getAllBalances,
  (_, activeFilter) => activeFilter,
  (balances, activeFilter) => {
    if (_isEmpty(activeFilter)) {
      return balances
    }

    const { base, quote } = activeFilter

    return _reduce(balances, (acc, b) => {
      const { currency } = b || {}
      if (currency === base || currency === quote) {
        acc[getKey(b)] = b
      }
      return acc
    }, {})
  },
)

export default getFilteredBalances
