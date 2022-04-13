import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getLaunchStrategyOptions, getLaunchStrategyModalVisible } from '../../redux/selectors/ui'
import LaunchStrategyModal from './LaunchStrategyModal'
import WSActions from '../../redux/actions/ws'

const mapStateToProps = (state = {}) => ({
  visible: getLaunchStrategyModalVisible(state),
  options: getLaunchStrategyOptions(state),
})

const mapDispatchToProps = dispatch => ({
  changeLaunchStrategyModalState: (isVisible) => {
    dispatch(UIActions.changeLaunchStrategyModalState(isVisible, {}))
  },
  dsExecuteLiveStrategy: ({
    authToken, name, symbol, tf, includeTrades, strategy, seedCandleCount, margin,
  }) => {
    dispatch(WSActions.setExecutionOptions({
      includeTrades, seedCandleCount, symbol, tf, margin,
    }))
    dispatch(WSActions.send(['strategy.execute_start', authToken, name, symbol, tf, includeTrades, strategy, seedCandleCount, margin]))
    dispatch(WSActions.setExecutionLoading(true))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(LaunchStrategyModal)
