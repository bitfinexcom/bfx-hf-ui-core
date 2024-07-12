import { connect } from 'react-redux'
import UIActions from '../../redux/actions/ui'
import { getUIModalStateForKey } from '../../redux/selectors/ui'

import BadConnectionModal from './BadConnectionModal'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state, UI_MODAL_KEYS.BAD_INTERNET_CONNECTION_MODAL),
})

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.BAD_INTERNET_CONNECTION_MODAL, false)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BadConnectionModal)
