import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import GAActions from '../../redux/actions/google_analytics'
import WSActions from '../../redux/actions/ws'
import { getIsConfirmDMSModalVisible, SETTINGS } from '../../redux/selectors/ui'

import ConfirmDMSModal from './ConfirmDMSModal'

const mapStateToProps = (state = {}) => ({
  visible: getIsConfirmDMSModalVisible(state),
})

const mapDispatchToProps = dispatch => ({
  changeConfirmDMSModalState: (isVisible) => dispatch(UIActions.changeConfirmDMSModalState(isVisible)),
  changeDMSSetting: (nextDms) => {
    dispatch(WSActions.saveSettings(SETTINGS.DMS, nextDms))
    dispatch(GAActions.updateSettings())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDMSModal)
