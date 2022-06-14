import { connect } from 'react-redux'
import { STRATEGY_PAGE } from '../../redux/constants/ui'
import {
  getFirstLogin,
  getGuideStatusForPage,
  getStrategyContent,
} from '../../redux/selectors/ui'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'

import StrategiesPage from './Strategies'
import { getAuthToken } from '../../redux/selectors/ws'

const mapStateToProps = (state) => ({
  authToken: getAuthToken(state),
  firstLogin: getFirstLogin(state),
  isGuideActive: getGuideStatusForPage(state, STRATEGY_PAGE),
  strategyContent: getStrategyContent(state),
})

const mapDispatchToProps = (dispatch) => ({
  finishGuide() {
    dispatch(UIActions.finishGuide(STRATEGY_PAGE))
  },
  setStrategyContent(content) {
    dispatch(UIActions.updateStrategyContent(content))
  },
  selectStrategy() {
    dispatch(UIActions.strategySelect())
  },
  onSave: (authToken, strategy = {}) => {
    dispatch(WSActions.send(['strategy.save', authToken, strategy]))
  },
  onRemove: (authToken, id) => {
    dispatch(WSActions.send(['strategy.remove', authToken, id]))
    dispatch(WSActions.resetBacktestData())
    dispatch(UIActions.clearStrategies())
  },
  clearBacktestOptions: () => {
    dispatch(WSActions.resetBacktestData())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategiesPage)
