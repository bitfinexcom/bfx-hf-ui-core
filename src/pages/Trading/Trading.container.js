import { connect } from 'react-redux'

import { apiClientConnected } from '../../redux/selectors/ws'
import { getHasActiveAlgoOrders, getShowActiveAlgoModal } from '../../redux/selectors/ao'
import {
  getUIState,
} from '../../redux/selectors/ui'

import Trading from './Trading'
import { UI_KEYS } from '../../redux/constants/ui_keys'

const mapStateToProps = (state = {}) => ({
  showAlgoModal: getShowActiveAlgoModal(state),
  apiClientConnected: apiClientConnected(state),
  hasActiveAlgoOrders: getHasActiveAlgoOrders(state),
  isBadConnection: getUIState(state, UI_KEYS.isBadInternetConnection, false),
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Trading)
