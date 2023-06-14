import { connect } from 'react-redux'

import { resumeRemoveActiveAlgoOrders } from '../../redux/actions/ao'
import { getActiveAlgoOrders, getIsActiveAlgoOrdersAfterLogin } from '../../redux/selectors/ao'

import ActiveAlgoOrdersModal from './ActiveAlgoOrdersModal'

const mapStateToProps = (state = {}) => ({
  activeAlgoOrders: getActiveAlgoOrders(state),
  isAfterLogin: getIsActiveAlgoOrdersAfterLogin(state),
})

const mapDispatchToProps = {
  resumeRemoveActiveAlgoOrders,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveAlgoOrdersModal)
