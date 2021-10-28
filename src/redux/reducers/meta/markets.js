import _filter from 'lodash/filter'
import _find from 'lodash/find'
import _reduce from 'lodash/reduce'
import _union from 'lodash/union'
import types from '../../constants/ws'
import marketTypes from '../../constants/market'

const getInitialState = () => {
  return {}
}

const GROUP_BY = 'wsID'

export default (state = getInitialState(), action = {}) => {
  const { type, payload = {} } = action

  switch (type) {
    case types.DATA_MARKETS: {
      const { markets = {} } = payload

      return _reduce(markets, (acc, market) => {
        acc[market[GROUP_BY]] = market
        return acc
      }, {})
    }

    case marketTypes.SET_CCY_FULL_NAMES: {
      const { names: [namesArr] } = payload
      const markets = { ...state }

      const newState = _reduce(markets, (acc, market) => {
        const {
          quote, base, uiID, wsID,
        } = market
        const defaultArray = [quote, base, uiID, wsID]
        const fullNamesArray = _filter(namesArr, (pair) => {
          const [shortName] = pair
          return shortName === quote || shortName === base
        }, defaultArray)

        let labels = []
        if (fullNamesArray.length === 1) {
          const fullName = fullNamesArray[0][1]
          labels = [fullName]
        }
        if (fullNamesArray.length === 2) {
          const [firstPair, secondPair] = fullNamesArray
          labels = [...firstPair, ...secondPair]
        }

        // eslint-disable-next-line no-param-reassign
        const newMarketObject = {
          ...market,
          ccyLabels: _union(defaultArray, labels),
        }

        acc[market[GROUP_BY]] = newMarketObject

        return acc
      }, {})

      return newState
    }
    case marketTypes.SET_PERPS_NAMES: {
      const { names: [namesArr] } = payload
      const markets = { ...state }

      const newState = _reduce(markets, (acc, market) => {
        const perpPair = _find(namesArr, (pair) => {
          const [wsID] = pair
          const combinedPair = `${market.base}:${market.quote}`
          return combinedPair === wsID
        }, null)

        const key = market[GROUP_BY]

        if (!perpPair) {
          acc[key] = { ...market, isPerp: false }
        } else {
          const [, perpID] = perpPair

          acc[key] = { ...market, uiID: perpID, isPerp: true }
        }

        return acc
      }, {})

      return newState
    }

    default: {
      return state
    }
  }
}
