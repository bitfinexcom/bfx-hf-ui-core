import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import GAActions from '../../redux/actions/google_analytics'
import WSActions from '../../redux/actions/ws'
import { getUIModalStateForKey, SETTINGS_KEYS } from '../../redux/selectors/ui'

import ConfirmDMSModal from './ConfirmDMSModal'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state, UI_MODAL_KEYS.CONFIRM_DMS_MODAL),
})

const mapDispatchToProps = dispatch => ({
  changeConfirmDMSModalState: (isVisible) => dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.CONFIRM_DMS_MODAL, isVisible)),
  changeDMSSetting: (nextDms) => {
    dispatch(WSActions.saveSettings(SETTINGS_KEYS.DMS, nextDms))
    dispatch(GAActions.updateSettings())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDMSModal)
