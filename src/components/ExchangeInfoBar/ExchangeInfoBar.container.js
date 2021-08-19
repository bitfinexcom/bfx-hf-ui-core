import { connect } from 'react-redux'
import _isEqual from 'lodash/isEqual'

import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import {
  getActiveMarket, getCurrentMode, getTickersVolumeUnit, getShowOnlyFavoritePairsSetting,
} from '../../redux/selectors/ui'
import { SETTINGS } from '../../redux/selectors/ui/get_settings'
import {
  getAuthToken, getFavoritePairsObject,
} from '../../redux/selectors/ws'
import { getTicker, getTickersArray, getMarkets } from '../../redux/selectors/meta'

import ExchangeInfoBar from './ExchangeInfoBar'
import { getActiveMarketCcyId } from '../../redux/selectors/zendesk'

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
    showOnlyFavoritePairs: getShowOnlyFavoritePairsSetting(state),
    isCcyArticleAvailbale: Boolean(getActiveMarketCcyId(state)),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onChangeMarket: (market, prevMarket) => {
    if (_isEqual(market, prevMarket)) {
      return
    }
    dispatch(UIActions.setActiveMarket(market))
  },

  updateFavorites: (newArray, currentMode) => {
    dispatch(WSActions.send([
      'favourite_trading_pairs.save',
      newArray,
      currentMode,
    ]))
  },
  setVolumeUnit: (key) => dispatch(UIActions.changeTickersVolumeUnit(key)),
  updateShowOnlyFavoritePairs: (showOnlyFavoritePairs) => dispatch(WSActions.saveSettings(SETTINGS.SHOW_ONLY_FAVORITE_PAIRS, showOnlyFavoritePairs)),
  showCcyIconModal: () => dispatch(UIActions.changeCcyInfoModalState(true)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeInfoBar)
