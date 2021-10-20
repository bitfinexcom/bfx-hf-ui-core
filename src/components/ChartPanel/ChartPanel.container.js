import { connect } from 'react-redux'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import ChartPanel from './ChartPanel'
import { updateComponentState as updateState } from '../../redux/actions/ui'
import { getMarkets } from '../../redux/selectors/meta'
import { getActiveMarket, getComponentState } from '../../redux/selectors/ui'

const mapStateToProps = (state = {}, ownProps = {}) => {
  const { layoutID, layoutI: id } = ownProps

  return {
    savedState: getComponentState(state, layoutID, 'chart', id),
    activeMarket: getActiveMarket(state),
    markets: getMarkets(state),
    getCurrencySymbol: reduxSelectors.getCurrencySymbolMemo(state),
  }
}

const mapDispatchToProps = dispatch => ({
  updateState: (layoutID, componentID, state) => {
    dispatch(updateState({
      state,
      layoutID,
      componentID,
    }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartPanel)
