import { connect } from 'react-redux'

import { handleActiveOrders, showActiveOrdersModal } from '../../redux/actions/ao'
import { getActiveAlgoOrders } from '../../redux/selectors/ao'

import ActiveAlgoOrdersModal from './ActiveAlgoOrdersModal'

const mapStateToProps = (state = {}) => ({
  activeAlgoOrders: getActiveAlgoOrders(state),
})

const mapDispatchToProps = {
  showActiveOrdersModal,
  handleActiveOrders,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveAlgoOrdersModal)
