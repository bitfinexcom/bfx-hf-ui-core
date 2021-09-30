import { connect } from 'react-redux'
import { getMarketPair } from '../../redux/selectors/meta'
import { getOrderHistory } from '../../redux/selectors/ws'
import OrderHistory from './OrderHistory'

const mapStateToProps = (state) => ({
  orders: getOrderHistory(state),
  getMarketPair: getMarketPair(state),
})

export default connect(mapStateToProps)(OrderHistory)
