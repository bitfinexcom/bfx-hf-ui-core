import { connect } from 'react-redux'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { getUIModalStateForKey } from '../../redux/selectors/ui'
import { SETTINGS_KEYS } from '../../redux/selectors/ui/get_settings'

import AOPauseModal from './AOPauseModal'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state, UI_MODAL_KEYS.AO_PAUSE_MODAL),
})

const mapDispatchToProps = dispatch => ({
  changeAOPauseModalState: (visible) => {
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.AO_PAUSE_MODAL, visible))
  },
  onDontShowAgain: () => dispatch(WSActions.saveSetting(SETTINGS_KEYS.SHOW_ALGO_PAUSE_INFO, false)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AOPauseModal)
