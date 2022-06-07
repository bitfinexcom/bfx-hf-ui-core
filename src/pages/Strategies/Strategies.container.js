import { connect } from 'react-redux'
import { STRATEGY_PAGE } from '../../redux/constants/ui'
import { getFirstLogin, getGuideStatusForPage } from '../../redux/selectors/ui'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'

import StrategiesPage from './Strategies'
import { getAuthToken } from '../../redux/selectors/ws'
import { getMarketsForExecution } from '../../redux/selectors/meta'

const mapStateToProps = (state) => ({
  authToken: getAuthToken(state),
  firstLogin: getFirstLogin(state),
  isGuideActive: getGuideStatusForPage(state, STRATEGY_PAGE),
  strategyContent: state.ui.content,
  markets: getMarketsForExecution(state),
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
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategiesPage)
