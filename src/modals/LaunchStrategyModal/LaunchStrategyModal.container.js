import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import {
  getLaunchStrategyOptions, getLaunchStrategyModalVisible, getLaunchStrategyIdModal,
} from '../../redux/selectors/ui'
import LaunchStrategyModal from './LaunchStrategyModal'

const mapStateToProps = (state = {}) => ({
  visible: getLaunchStrategyModalVisible(state),
  options: getLaunchStrategyOptions(state),
  strategyId: getLaunchStrategyIdModal(state),
})

const mapDispatchToProps = dispatch => ({
  changeLaunchStrategyModalState: (isVisible) => {
    dispatch(UIActions.changeLaunchStrategyModalState(isVisible, '', {}))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(LaunchStrategyModal)
