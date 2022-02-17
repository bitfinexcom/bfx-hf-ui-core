import { connect } from 'react-redux'

import { getAuthToken, getAllPositions, getFilteredPositions } from '../../redux/selectors/ws'
import { getMarketPair } from '../../redux/selectors/meta'
import PositionsTable from './PositionsTable'
import { closePosition } from './PositionsTable.helpers'

const mapStateToProps = (state = {}, { activeFilter } = {}) => ({
  authToken: getAuthToken(state),
  filteredPositions: getFilteredPositions(state)(activeFilter),
  positions: getAllPositions(state),
  getMarketPair: getMarketPair(state),
})

const mapDispatchToProps = dispatch => ({
  closePosition: (authToken, position = {}) => closePosition(authToken, position, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(PositionsTable)
