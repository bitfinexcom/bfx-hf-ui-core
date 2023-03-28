import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getUIModalStateForKey, getThemeSetting } from '../../redux/selectors/ui'
// import { getAuthToken } from '../../redux/selectors/ws'
import HelpUsImproveHoney from './HelpUsImproveHoney'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state, UI_MODAL_KEYS.HELP_US_IMPROVE_HONEY_MODAL),
  // authToken: getAuthToken(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = dispatch => ({
  closeHelpUsImproveHoneyModal: () => {
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.HELP_US_IMPROVE_HONEY_MODAL, false))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(HelpUsImproveHoney)
