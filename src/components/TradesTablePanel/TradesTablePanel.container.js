import { connect } from 'react-redux'

import { reduxSelectors } from '@ufx-ui/bfx-containers'
import UIActions from '../../redux/actions/ui'
import { getMarkets } from '../../redux/selectors/meta'
import { getAuthToken } from '../../redux/selectors/ws'
import {
  getActiveMarket, getComponentState, getMarketComponents,
} from '../../redux/selectors/ui'

import TradesTablePanel from './TradesTablePanel'

const mapStateToProps = (state = {}, { layoutID, layoutI: id } = {}) => ({
  allMarketTrades: getMarketComponents(state, 'trades'),
  markets: getMarkets(state),
  authToken: getAuthToken(state),
  activeMarket: getActiveMarket(state),
  savedState: getComponentState(state, layoutID, 'trades', id),
  getCurrencySymbol: reduxSelectors.getCurrencySymbolMemo(state),
})

const mapDispatchToProps = dispatch => ({
  updateState: (layoutID, componentID, state) => {
    dispatch(UIActions.updateComponentState({
      state,
      layoutID,
      componentID,
    }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(TradesTablePanel)
