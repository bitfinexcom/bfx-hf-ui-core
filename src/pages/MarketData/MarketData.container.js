import { connect } from 'react-redux'

import {
  getGuideStatusForPage,
  getUIState,
} from '../../redux/selectors/ui'

import { MARKET_PAGE } from '../../redux/constants/ui'
import UIActions from '../../redux/actions/ui'
import MarketData from './MarketData'
import { UI_KEYS } from '../../redux/constants/ui_keys'

const mapStateToProps = (state = {}) => ({
  isFirstLogin: getUIState(state, UI_KEYS.firstLogin),
  isGuideActive: getGuideStatusForPage(state, MARKET_PAGE),
})

const mapDispatchToProps = dispatch => ({
  finishGuide: () => {
    dispatch(UIActions.finishGuide(MARKET_PAGE))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketData)
