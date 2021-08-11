import { connect } from 'react-redux'
import { getActiveMarketArticle, getIsCcyInfoModalVisible } from '../../redux/selectors/ui'
import CcyInfoModal from './CcyInfoModal'
import UIActions from '../../redux/actions/ui'

const mapStateToProps = (state = {}) => ({
  isModalVisible: getIsCcyInfoModalVisible(state),
  article: getActiveMarketArticle(state),
})

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(UIActions.changeCcyInfoModalState(false)),
  fetchCcyArticle: () => dispatch(UIActions.fetchCcyArticle()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CcyInfoModal)
