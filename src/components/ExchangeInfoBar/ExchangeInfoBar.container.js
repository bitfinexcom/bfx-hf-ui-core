import { connect } from 'react-redux'
import _isEqual from 'lodash/isEqual'

import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import {
  getActiveMarket, getCurrentMode, getTickersVolumeUnit, getShowOnlyFavoritePairs,
} from '../../redux/selectors/ui'
import { SHOW_ONLY_FAV_PAIRS_KEY } from '../../redux/selectors/ui/get_settings'
import {
  getAuthToken, getFavoritePairsObject,
} from '../../redux/selectors/ws'
import { getTicker, getTickersArray, getMarkets } from '../../redux/selectors/meta'

import ExchangeInfoBar from './ExchangeInfoBar'

const mapStateToProps = (state = {}) => {
  const activeMarket = getActiveMarket(state)

  return {
    activeMarket,
    activeMarketTicker: getTicker(state, activeMarket),
    allTickersArray: getTickersArray(state),
    favoritePairs: getFavoritePairsObject(state),
    markets: getMarkets(state),
    authToken: getAuthToken(state),
    currentMode: getCurrentMode(state),
    tickersVolumeUnit: getTickersVolumeUnit(state),
    showOnlyFavoritePairs: getShowOnlyFavoritePairs(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onChangeMarket: (market, prevMarket) => {
    if (_isEqual(market, prevMarket)) {
      return
    }
    dispatch(UIActions.setActiveMarket(market))
  },

  updateFavorites: (authToken, newArray, currentMode) => {
    dispatch(WSActions.send([
      'favourite_trading_pairs.save',
      authToken,
      newArray,
      currentMode,
    ]))
  },
  setVolumeUnit: (key) => dispatch(UIActions.changeTickersVolumeUnit(key)),

  updateShowOnlyFavoritePairs: (showOnlyFavoritePairs) => dispatch(WSActions.saveSettings(SHOW_ONLY_FAV_PAIRS_KEY, showOnlyFavoritePairs)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeInfoBar)
