import { connect } from 'react-redux'
import { STRATEGY_PAGE } from '../../redux/constants/ui'
import { getFirstLogin, getGuideStatusForPage } from '../../redux/selectors/ui'
import UIActions from '../../redux/actions/ui'

import StrategiesPage from './Strategies'

const mapStateToProps = state => ({
  firstLogin: getFirstLogin(state),
  isGuideActive: getGuideStatusForPage(state, STRATEGY_PAGE),
  strategyContent: state.ui.content,
})

const mapDispatchToProps = dispatch => ({
  finishGuide() {
    dispatch(UIActions.finishGuide(STRATEGY_PAGE))
  },
  setStrategyContent(content) {
    dispatch(UIActions.updateStrategyContent(content))
  },
  selectStrategy() {
    dispatch(UIActions.strategySelect())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategiesPage)
