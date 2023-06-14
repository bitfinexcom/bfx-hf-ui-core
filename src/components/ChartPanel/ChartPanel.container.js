import { connect } from 'react-redux'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import ChartPanel from './ChartPanel'
import { getMarkets } from '../../redux/selectors/meta'
import {
  getActiveMarket, getThemeSetting,
} from '../../redux/selectors/ui'

const mapStateToProps = (state = {}) => {
  return {
    activeMarket: getActiveMarket(state),
    markets: getMarkets(state),
    getCurrencySymbol: reduxSelectors.getCurrencySymbolMemo(state),
    settingsTheme: getThemeSetting(state),
  }
}

export default connect(mapStateToProps)(ChartPanel)
