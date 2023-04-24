import { connect } from 'react-redux'
import _isEqual from 'lodash/isEqual'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import {
  getActiveMarket, getCurrentMode, getTickersVolumeUnit, getShowOnlyFavoritePairsSetting,
} from '../../redux/selectors/ui'
import { SETTINGS_KEYS } from '../../redux/selectors/ui/get_settings'
import {
  getAuthToken, getFavoritePairsObject,
} from '../../redux/selectors/ws'
import { getTicker, getTickersArray, getMarkets } from '../../redux/selectors/meta'

import ExchangeInfoBar from './ExchangeInfoBar'
import { getActiveMarketCcyId } from '../../redux/selectors/zendesk'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const { getCurrencySymbolMemo } = reduxSelectors

const mapStateToProps = (state = {}) => {
  const activeMarket = getActiveMarket(state)
  const allTickersArray = getTickersArray(state)

  return {
    activeMarket,
    activeMarketTicker: getTicker(state, activeMarket),
    allTickersArray,
    favoritePairs: getFavoritePairsObject(state),
    markets: getMarkets(state),
    authToken: getAuthToken(state),
    currentMode: getCurrentMode(state),
    tickersVolumeUnit: getTickersVolumeUnit(state),
    showOnlyFavoritePairs: getShowOnlyFavoritePairsSetting(state),
    isCcyArticleAvailbale: Boolean(getActiveMarketCcyId(state)),
    getCurrencySymbol: getCurrencySymbolMemo(state),
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
  updateShowOnlyFavoritePairs: (showOnlyFavoritePairs) => dispatch(WSActions.saveSetting(SETTINGS_KEYS.SHOW_ONLY_FAVORITE_PAIRS, showOnlyFavoritePairs)),
  showCcyIconModal: () => dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.CCY_INFO_MODAL, true)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeInfoBar)
