import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { TRADING_PAGE } from '../../redux/constants/ui'
import { apiClientConnected } from '../../redux/selectors/ws'
import { getHasActiveAlgoOrders, getShowActiveAlgoModal } from '../../redux/selectors/ao'
import {
  getGuideStatusForPage,
  getUIState,
} from '../../redux/selectors/ui'

import Trading from './Trading'
import { UI_KEYS } from '../../redux/constants/ui_keys'

const mapStateToProps = (state = {}) => ({
  firstLogin: getUIState(state, UI_KEYS.firstLogin),
  showAlgoModal: getShowActiveAlgoModal(state),
  apiClientConnected: apiClientConnected(state),
  hasActiveAlgoOrders: getHasActiveAlgoOrders(state),
  isGuideActive: getGuideStatusForPage(state, TRADING_PAGE),
  isBadConnection: getUIState(state, UI_KEYS.isBadInternetConnection),
})

const mapDispatchToProps = dispatch => ({
  finishGuide: () => dispatch(UIActions.finishGuide(TRADING_PAGE)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Trading)
