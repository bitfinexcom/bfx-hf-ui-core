import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getAllPositions, getFilteredPositions } from '../../redux/selectors/ws'
import { getMarketPair } from '../../redux/selectors/meta'
import PositionsTable from './PositionsTable'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { UI_KEYS } from '../../redux/constants/ui_keys'

const mapStateToProps = (state = {}, { activeFilter } = {}) => ({
  filteredPositions: getFilteredPositions(state)(activeFilter),
  positions: getAllPositions(state),
  getMarketPair: getMarketPair(state),
})

const mapDispatchToProps = dispatch => ({
  setClosePositionModal: (isVisible, rowData) => {
    dispatch(UIActions.setUIValue(UI_KEYS.closePositionModalData, rowData))
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.CLOSE_POSITION_MODAL, isVisible))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(PositionsTable)
