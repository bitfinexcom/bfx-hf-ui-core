import { connect } from 'react-redux'

import {
  getCurrentModeAlgoOrders,
  getFilteredAlgoOrders,
} from '../../redux/selectors/ws'
import { getActiveMarket } from '../../redux/selectors/ui'
import AlgoOrdersTable from './AlgoOrdersTable'
import { getMarketPair } from '../../redux/selectors/meta'
import { getShowAOsHistory } from '../../redux/selectors/ao'

const mapStateToProps = (state = {}, { activeFilter }) => ({
  algoOrders: getCurrentModeAlgoOrders(state),
  filteredAlgoOrders: getFilteredAlgoOrders(state)(activeFilter),
  activeMarket: getActiveMarket(state),
  getMarketPair: getMarketPair(state),
  showHistory: getShowAOsHistory(state),
})

export default connect(mapStateToProps)(AlgoOrdersTable)
