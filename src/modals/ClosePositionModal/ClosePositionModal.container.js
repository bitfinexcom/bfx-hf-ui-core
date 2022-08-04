import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getClosePositionModalData, getUIModalStateForKey } from '../../redux/selectors/ui'
import { getMarketPair } from '../../redux/selectors/meta'
import { getAuthToken } from '../../redux/selectors/ws'
import { closePosition } from '../../components/PositionsTable/PositionsTable.helpers'
import ClosePositionModal from './ClosePositionModal'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state, UI_MODAL_KEYS.CLOSE_POSITION_MODAL),
  rowData: getClosePositionModalData(state),
  authToken: getAuthToken(state),
  getMarketPair: getMarketPair(state),
})

const mapDispatchToProps = dispatch => ({
  closeClosePositionModal: () => {
    dispatch(UIActions.changeClosePositionModalData({}))
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.CLOSE_POSITION_MODAL, false))
  },
  closePosition: (authToken, position = {}) => closePosition(authToken, position, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClosePositionModal)
