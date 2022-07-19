import { connect } from 'react-redux'
import UIActions from '../../redux/actions/ui'
import {
  getIsNoConnectionModalVisible,
} from '../../redux/selectors/ui'

import NoConnectionActionModal from './NoConnectionActionModal'

const mapStateToProps = (state = {}) => ({
  visible: getIsNoConnectionModalVisible(state),
})

const mapDispatchToProps = dispatch => ({
  changeIsNoConnectionModalState: (visible) => dispatch(UIActions.changeIsNoConnectionModalState(visible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoConnectionActionModal)
