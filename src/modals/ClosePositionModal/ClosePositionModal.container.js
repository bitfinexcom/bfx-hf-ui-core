import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getIsClosePositionModalVisible, getClosePositionModalData } from '../../redux/selectors/ui'
import { getMarketPair } from '../../redux/selectors/meta'
import { getAuthToken } from '../../redux/selectors/ws'
import { closePosition } from '../../components/PositionsTable/PositionsTable.helpers'
import ClosePositionModal from './ClosePositionModal'

const mapStateToProps = (state = {}) => ({
  visible: getIsClosePositionModalVisible(state),
  rowData: getClosePositionModalData(state),
  authToken: getAuthToken(state),
  getMarketPair: getMarketPair(state),
})

const mapDispatchToProps = dispatch => ({
  changeClosePositionModalState: (isVisible) => {
    dispatch(UIActions.changeClosePositionModalState(isVisible, {}))
  },
  closePosition: (authToken, position = {}) => closePosition(authToken, position, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClosePositionModal)
