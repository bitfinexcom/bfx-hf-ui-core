import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { getAuthToken } from '../../redux/selectors/ws'
import { getUIModalStateForKey } from '../../redux/selectors/ui'

import ResetAPIKeysModal from './ResetAPIKeysModal'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const mapStateToProps = (state = {}) => ({
  liveVisible: getUIModalStateForKey(state, UI_MODAL_KEYS.RESET_LIVE_API_KEY_MODAL),
  paperVisible: getUIModalStateForKey(state, UI_MODAL_KEYS.RESET_PAPER_API_KEY_MODAL),
  authToken: getAuthToken(state),
})

const mapDispatchToProps = dispatch => ({
  changeResetAPIKeysModalState: (isVisible) => {
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.RESET_LIVE_API_KEY_MODAL, isVisible))
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.RESET_PAPER_API_KEY_MODAL, isVisible))
  },
  resetAPIKeys: (authToken, mode) => {
    dispatch(WSActions.updatingApiKey(mode, true))
    dispatch(WSActions.send([
      'api_credentials.reset',
      authToken,
      mode,
    ]))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetAPIKeysModal)
