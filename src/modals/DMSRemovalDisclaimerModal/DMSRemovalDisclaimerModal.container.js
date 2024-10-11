import { connect } from 'react-redux'

import { changeUIModalState } from '../../redux/actions/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { getUIModalStateForKey } from '../../redux/selectors/ui'
import DMSRemovalDisclaimerModal from './DMSRemovalDisclaimerModal'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state, UI_MODAL_KEYS.DMS_REMOVAL_DISCLAIMER),
})

const mapDispatchToProps = {
  changeUIModalState,
}

export default connect(mapStateToProps, mapDispatchToProps)(DMSRemovalDisclaimerModal)
