import _keys from 'lodash/keys'
import { createSelector } from 'reselect'
import { getMarkets } from '.'

const getMarketTickersKeys = createSelector([getMarkets], (markets) => _keys(markets))

export default getMarketTickersKeys
