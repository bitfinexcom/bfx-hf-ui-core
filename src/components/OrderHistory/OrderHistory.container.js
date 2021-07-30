import { connect } from 'react-redux'
import { getOrderHistory } from '../../redux/selectors/ws'
import OrderHistory from './OrderHistory'

const mapStateToProps = (state = {}) => ({
  orders: getOrderHistory(state),
})

export default connect(mapStateToProps)(OrderHistory)
