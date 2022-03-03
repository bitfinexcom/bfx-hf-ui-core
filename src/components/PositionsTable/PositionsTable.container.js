import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getAllPositions, getFilteredPositions } from '../../redux/selectors/ws'
import { getMarketPair } from '../../redux/selectors/meta'
import PositionsTable from './PositionsTable'

const mapStateToProps = (state = {}, { activeFilter } = {}) => ({
  filteredPositions: getFilteredPositions(state)(activeFilter),
  positions: getAllPositions(state),
  getMarketPair: getMarketPair(state),
})

const mapDispatchToProps = dispatch => ({
  setClosePositionModal: (isVisible, rowData) => {
    dispatch(UIActions.changeClosePositionModalState(isVisible, rowData))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(PositionsTable)
