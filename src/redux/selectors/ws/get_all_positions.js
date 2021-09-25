import _get from 'lodash/get'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import { getPairFromMarket } from '../../../util/market'
import { REDUCER_PATHS } from '../../config'
import { getMarkets } from '../meta'

const { getCurrencySymbolMemo } = reduxSelectors

const path = REDUCER_PATHS.WS

const EMPTY_ARR = []

const allPositions = (state) => {
  return _get(state, `${path}.positions`, EMPTY_ARR)
}

const positionWithReplacedPairs = createSelector([getMarkets, allPositions, getCurrencySymbolMemo], (markets, positions, getCurrencySymbol) => {
  return _map(positions, (position) => {
    const currentMarket = markets?.[position?.symbol]

    return {
      ...position,
      uiID: getPairFromMarket(currentMarket, getCurrencySymbol),
    }
  })
})

export default positionWithReplacedPairs
