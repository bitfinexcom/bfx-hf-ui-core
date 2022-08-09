import { connect } from 'react-redux'
import { STRATEGY_PAGE } from '../../redux/constants/ui'
import {
  getGuideStatusForPage,
  getUIState,
} from '../../redux/selectors/ui'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'

import StrategiesPage from './Strategies'
import { getAuthToken, getBacktestResults } from '../../redux/selectors/ws'
import { UI_KEYS } from '../../redux/constants/ui_keys'

const mapStateToProps = (state) => ({
  authToken: getAuthToken(state),
  firstLogin: getUIState(state, UI_KEYS.firstLogin),
  isGuideActive: getGuideStatusForPage(state, STRATEGY_PAGE),
  strategy: getUIState(state, UI_KEYS.currentStrategy),
  backtestResults: getBacktestResults(state),
})

const mapDispatchToProps = (dispatch) => ({
  finishGuide() {
    dispatch(UIActions.finishGuide(STRATEGY_PAGE))
  },
  setStrategy(strategy) {
    dispatch(UIActions.setUIValue(UI_KEYS.currentStrategy, strategy))
  },
  onSave: (authToken, strategy = {}) => {
    dispatch(WSActions.send(['strategy.save', authToken, strategy]))
  },
  onRemove: (authToken, id) => {
    dispatch(WSActions.send(['strategy.remove', authToken, id]))
    dispatch(WSActions.resetBacktestData())
    dispatch(UIActions.setUIValue(UI_KEYS.currentStrategy, {}))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategiesPage)
