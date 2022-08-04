import { connect } from 'react-redux'

import { changeUIModalState } from '../../redux/actions/ui'
import { getOldFormatModalState } from '../../redux/selectors/ui'

import OldFormatModal from './OldFormatModal'

const mapStateToProps = (state = {}) => ({
  visible: getOldFormatModalState(state),
})

const mapDispatchToProps = {
  changeUIModalState,
}

export default connect(mapStateToProps, mapDispatchToProps)(OldFormatModal)
