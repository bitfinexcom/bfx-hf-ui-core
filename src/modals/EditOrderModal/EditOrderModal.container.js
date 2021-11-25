import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import UIActions from '../../redux/actions/ui'
import {
  getIsEditOrderModalShown, getOrderToEdit,
} from '../../redux/selectors/ui'

import EditOrderModal from './EditOrderModal'

const mapStateToProps = (state = {}) => ({
  visible: getIsEditOrderModalShown(state),
  order: getOrderToEdit(state),
})

const mapDispatchToProps = dispatch => ({
  changeVisibilityState: (visible) => dispatch(UIActions.changeEditOrderModalState(visible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditOrderModal)
