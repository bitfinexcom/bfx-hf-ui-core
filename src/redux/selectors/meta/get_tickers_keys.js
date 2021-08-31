import _keys from 'lodash/keys'
import _filter from 'lodash/filter'
import { createSelector } from 'reselect'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import getMarkets from './get_markets'

const { getIsSecuritiesPair, getIsTradingPair, getIsDerivativePair } = reduxSelectors

const getTickersKeys = createSelector(
  getMarkets,
  getIsTradingPair,
  getIsDerivativePair,
  getIsSecuritiesPair,
  (markets, isTradingPair, isDerivativePair, isSecuritiesPair) => _filter(_keys(markets), (pair) => (isTradingPair(pair) || isDerivativePair(pair)) && !isSecuritiesPair(pair)),
)

export default getTickersKeys
