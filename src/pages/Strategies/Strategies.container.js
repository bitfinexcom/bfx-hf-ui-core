import { connect } from 'react-redux'
import {
  getUIState,
} from '../../redux/selectors/ui'
import UIActions, { setUIValue } from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'

import StrategiesPage from './Strategies'
import { getAuthToken, getBacktestResults } from '../../redux/selectors/ws'
import { UI_KEYS } from '../../redux/constants/ui_keys'

const EMP_OBJ = {}

const mapStateToProps = (state) => ({
  authToken: getAuthToken(state),
  strategy: getUIState(state, UI_KEYS.currentStrategy, EMP_OBJ),
  backtestResults: getBacktestResults(state),
  strategyDirty: getUIState(state, UI_KEYS.isStrategyDirty, false),
})

const mapDispatchToProps = (dispatch) => ({
  setStrategy(strategy) {
    dispatch(UIActions.setUIValue(UI_KEYS.currentStrategy, strategy))
  },
  onSave: (authToken, strategy = {}) => {
    dispatch(WSActions.send(['strategy.save', authToken, strategy]))
  },
  onRemove: (authToken, id) => {
    dispatch(UIActions.removeStrategy(authToken, id))
  },
  setStrategyDirty: (value) => dispatch(setUIValue(UI_KEYS.isStrategyDirty, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategiesPage)
