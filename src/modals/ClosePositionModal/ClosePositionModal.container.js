import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getUIModalStateForKey, getUIState } from '../../redux/selectors/ui'
import { getMarketPair } from '../../redux/selectors/meta'
import { getAuthToken } from '../../redux/selectors/ws'
import { closePosition } from '../../components/PositionsTable/PositionsTable.helpers'
import ClosePositionModal from './ClosePositionModal'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { UI_KEYS } from '../../redux/constants/ui_keys'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state, UI_MODAL_KEYS.CLOSE_POSITION_MODAL),
  rowData: getUIState(state, UI_KEYS.closePositionModalData),
  authToken: getAuthToken(state),
  getMarketPair: getMarketPair(state),
})

const mapDispatchToProps = dispatch => ({
  closeClosePositionModal: () => {
    dispatch(UIActions.setUIValue(UI_KEYS.closePositionModalData, {}))
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.CLOSE_POSITION_MODAL, false))
  },
  closePosition: (authToken, position = {}) => closePosition(authToken, position, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClosePositionModal)
