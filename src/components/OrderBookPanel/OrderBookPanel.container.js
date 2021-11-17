import { connect } from 'react-redux'

import { reduxSelectors } from '@ufx-ui/bfx-containers'
import {
  getActiveMarket, getComponentState, getMarketComponents,
} from '../../redux/selectors/ui'
import { getMarkets } from '../../redux/selectors/meta'
import UIActions from '../../redux/actions/ui'

import OrderBookPanel from './OrderBookPanel'

const mapStateToProps = (state = {}, ownProps = {}) => {
  const { layoutID, layoutI: id } = ownProps

  return {
    activeMarket: getActiveMarket(state),
    savedState: getComponentState(state, layoutID, 'book', id),
    markets: getMarkets(state),
    allMarketBooks: getMarketComponents(state, 'book'),
    getCurrencySymbol: reduxSelectors.getCurrencySymbolMemo(state),
  }
}

const mapDispatchToProps = dispatch => ({
  updateState: (layoutID, componentID, state) => {
    dispatch(UIActions.updateComponentState({
      state,
      layoutID,
      componentID,
    }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookPanel)
