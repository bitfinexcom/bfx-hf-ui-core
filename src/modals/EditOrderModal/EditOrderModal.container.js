import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import {
  getIsEditOrderModalShown, getOrderToEdit,
} from '../../redux/selectors/ui'
import { getAuthToken } from '../../redux/selectors/ws'

import EditOrderModal from './EditOrderModal'

const mapStateToProps = (state = {}) => ({
  visible: getIsEditOrderModalShown(state),
  order: getOrderToEdit(state),
  authToken: getAuthToken(state),
})

const mapDispatchToProps = dispatch => ({
  changeVisibilityState: (visible) => dispatch(UIActions.changeEditOrderModalState(visible)),
  updateOrder: (authToken, order, isAO) => {
    if (isAO) {
      // TODO: Algo Order support
    } else {
      dispatch(WSActions.send([
        'order.update', authToken, order,
      ]))
    }
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(EditOrderModal)
