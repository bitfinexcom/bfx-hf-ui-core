import { connect } from 'react-redux'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import ChartPanel from './ChartPanel'
import { saveComponentState as saveState } from '../../redux/actions/ui'
import { getMarkets } from '../../redux/selectors/meta'
import { getActiveMarket, getComponentState } from '../../redux/selectors/ui'

const mapStateToProps = (state = {}, ownProps = {}) => {
  const { layoutID, layoutI: id } = ownProps

  return {
    savedState: getComponentState(state, layoutID, 'trades', id),
    activeMarket: getActiveMarket(state),
    markets: getMarkets(state),
    getCurrencySymbol: reduxSelectors.getCurrencySymbolMemo(state),
  }
}

const mapDispatchToProps = {
  saveState,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartPanel)
