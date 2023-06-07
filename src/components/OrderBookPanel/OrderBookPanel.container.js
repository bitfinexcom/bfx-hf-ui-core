import { connect } from 'react-redux'

import { reduxSelectors } from '@ufx-ui/bfx-containers'
import {
  getActiveMarket, getMarketComponents,
} from '../../redux/selectors/ui'
import { getMarkets } from '../../redux/selectors/meta'

import OrderBookPanel from './OrderBookPanel'

const mapStateToProps = (state = {}) => {
  return {
    activeMarket: getActiveMarket(state),
    markets: getMarkets(state),
    allMarketBooks: getMarketComponents(state, 'book'),
    getCurrencySymbol: reduxSelectors.getCurrencySymbolMemo(state),
  }
}

export default connect(mapStateToProps)(OrderBookPanel)
