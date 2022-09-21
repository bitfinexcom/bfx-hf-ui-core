import { connect } from 'react-redux'
import UIActions from '../../redux/actions/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { getUIModalStateForKey } from '../../redux/selectors/ui'

import NoConnectionActionModal from './NoConnectionActionModal'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state, UI_MODAL_KEYS.NO_CONNECTION_MODAL),
})

const mapDispatchToProps = dispatch => ({
  changeIsNoConnectionModalState: (isOpen) => dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.NO_CONNECTION_MODAL, isOpen)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoConnectionActionModal)
