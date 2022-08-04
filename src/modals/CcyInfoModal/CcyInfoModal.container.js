import { connect } from 'react-redux'
import {
  getUIModalStateForKey, getThemeSetting,
} from '../../redux/selectors/ui'
import { getActiveMarketArticle } from '../../redux/selectors/zendesk'
import CcyInfoModal from './CcyInfoModal'
import UIActions from '../../redux/actions/ui'
import zendeskActions from '../../redux/actions/zendesk'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const mapStateToProps = (state = {}) => ({
  isModalVisible: getUIModalStateForKey(state, UI_MODAL_KEYS.CCY_INFO_MODAL),
  article: getActiveMarketArticle(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.CCY_INFO_MODAL, false)),
  fetchCcyArticle: () => dispatch(zendeskActions.fetchCcyArticle()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CcyInfoModal)
