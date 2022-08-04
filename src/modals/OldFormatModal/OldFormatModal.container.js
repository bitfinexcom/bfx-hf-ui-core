import { connect } from 'react-redux'

import { changeUIModalState } from '../../redux/actions/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { getUIModalStateForKey } from '../../redux/selectors/ui'

import OldFormatModal from './OldFormatModal'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state)(UI_MODAL_KEYS.OLD_FORMAT_MODAL),
})

const mapDispatchToProps = {
  changeUIModalState,
}

export default connect(mapStateToProps, mapDispatchToProps)(OldFormatModal)
