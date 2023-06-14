import { connect } from 'react-redux'

import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getMarkets } from '../../redux/selectors/meta'
import { getAuthToken } from '../../redux/selectors/ws'
import {
  getActiveMarket, getMarketComponents,
} from '../../redux/selectors/ui'

import TradesTablePanel from './TradesTablePanel'

const mapStateToProps = (state = {}) => ({
  allMarketTrades: getMarketComponents(state, 'trades'),
  markets: getMarkets(state),
  authToken: getAuthToken(state),
  activeMarket: getActiveMarket(state),
  getCurrencySymbol: reduxSelectors.getCurrencySymbolMemo(state),
})

export default connect(mapStateToProps)(TradesTablePanel)
