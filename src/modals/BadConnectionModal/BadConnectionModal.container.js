import { connect } from 'react-redux'
import UIActions from '../../redux/actions/ui'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import { getUIState } from '../../redux/selectors/ui'

import BadConnectionModal from './BadConnectionModal'

const mapStateToProps = (state = {}) => ({
  visible: getUIState(state, UI_KEYS.isBadInternetConnection, false),
})

const mapDispatchToProps = dispatch => ({
  changeBadInternetConnectionState: (visible) => dispatch(UIActions.setUIValue(UI_KEYS.isBadInternetConnection, visible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BadConnectionModal)
