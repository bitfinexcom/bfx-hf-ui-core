import { connect } from 'react-redux'
import { v4 } from 'uuid'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import UIActions from '../../redux/actions/ui'
import {
  getIsInternetConnection, SETTINGS, getRebootSetting,
} from '../../redux/selectors/ui'

import BadConnectionModal from './BadConnectionModal'

const mapStateToProps = (state = {}) => ({
  visible: getIsInternetConnection(state),
  rebootAutomatically: getRebootSetting(state),
})

const mapDispatchToProps = dispatch => ({
  changeBadInternetConnectionState: (visible) => dispatch(UIActions.changeBadInternetConnectionState(visible)),
  updateReboot: (reboot) => {
    dispatch(WSActions.saveSettings(SETTINGS.REBOOT_AUTOMATICALLY, reboot))
    dispatch(GAActions.updateSettings())
  },
  rebootnNotify: (text) => dispatch(UIActions.recvNotification({
    mts: Date.now(),
    status: 'info',
    text,
    cid: v4(),
  })),
})

export default connect(mapStateToProps, mapDispatchToProps)(BadConnectionModal)
