import { connect } from 'react-redux'
import { getActiveMarketArticle, getIsCCYInfoModalVisible } from '../../redux/selectors/ui'
import CCYInfoModal from './CCYInfoModal'
import UIActions from '../../redux/actions/ui'

const mapStateToProps = (state = {}) => ({
  isModalVisible: getIsCCYInfoModalVisible(state),
  article: getActiveMarketArticle(state),
})

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(UIActions.changeCCYInfoModalState(false)),
  fetchCCYArticle: () => dispatch(UIActions.fetchCCYArticle()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CCYInfoModal)
