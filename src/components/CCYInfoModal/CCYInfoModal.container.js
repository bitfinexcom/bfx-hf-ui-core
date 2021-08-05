import { connect } from 'react-redux'
import { getIsCCYInfoModalVisible } from '../../redux/selectors/ui'
import CCYInfoModal from './CCYInfoModal'
import UIActions from '../../redux/actions/ui'

const mapStateToProps = (state = {}) => ({
  isModalVisible: getIsCCYInfoModalVisible(state),
})

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(UIActions.changeCCYInfoModalState(false)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CCYInfoModal)
