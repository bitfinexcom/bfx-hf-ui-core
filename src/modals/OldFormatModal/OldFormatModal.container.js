import { connect } from 'react-redux'

import { changeOldFormatModalState } from '../../redux/actions/ui'
import { getOldFormatModalState } from '../../redux/selectors/ui'

import OldFormatModal from './OldFormatModal'

const mapStateToProps = (state = {}) => ({
  visible: getOldFormatModalState(state),
})

const mapDispatchToProps = {
  changeOldFormatModalState,
}

export default connect(mapStateToProps, mapDispatchToProps)(OldFormatModal)
