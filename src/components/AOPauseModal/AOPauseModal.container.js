import { connect } from 'react-redux'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { getIsAOPausedModalVisible } from '../../redux/selectors/ui'
import { SETTINGS } from '../../redux/selectors/ui/get_settings'

import AOPauseModal from './AOPauseModal'

const mapStateToProps = (state = {}) => ({
  visible: getIsAOPausedModalVisible(state),
})

const mapDispatchToProps = dispatch => ({
  changeAOPauseModalState: (visible) => {
    dispatch(UIActions.changeAOPauseModalState(visible))
  },
  onDontShowAgain: () => dispatch(WSActions.saveSettings(SETTINGS.SHOW_ALGO_PAUSE_INFO, false)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AOPauseModal)
