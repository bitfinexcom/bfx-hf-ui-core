import { connect } from 'react-redux'
import {
  getIsCcyInfoModalVisible, getThemeSetting,
} from '../../redux/selectors/ui'
import { getActiveMarketArticle } from '../../redux/selectors/zendesk'
import CcyInfoModal from './CcyInfoModal'
import UIActions from '../../redux/actions/ui'
import zendeskActions from '../../redux/actions/zendesk'

const mapStateToProps = (state = {}) => ({
  isModalVisible: getIsCcyInfoModalVisible(state),
  article: getActiveMarketArticle(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(UIActions.changeCcyInfoModalState(false)),
  fetchCcyArticle: () => dispatch(zendeskActions.fetchCcyArticle()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CcyInfoModal)
