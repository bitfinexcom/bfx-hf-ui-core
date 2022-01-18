import { connect } from 'react-redux'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import WSActions from '../../redux/actions/ws'
import { getAuthToken, getFavoritePairs } from '../../redux/selectors/ws'
import { getCurrentMode, getThemeSetting } from '../../redux/selectors/ui'
import MarketSelect from './MarketSelect'

const mapStateToProps = state => ({
  favoritePairs: getFavoritePairs(state),
  authToken: getAuthToken(state),
  currentMode: getCurrentMode(state),
  getCurrencySymbol: reduxSelectors.getCurrencySymbolMemo(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = dispatch => ({
  savePairs: (pairs, authToken, currentMode) => {
    dispatch(WSActions.send([
      'favourite_trading_pairs.save',
      authToken,
      pairs,
      currentMode,
    ]))
  },
})

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MarketSelect)
