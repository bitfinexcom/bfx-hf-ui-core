import { connect } from 'react-redux'
import { STRATEGY_PAGE } from '../../redux/constants/ui'
import { getFirstLogin, getGuideStatusForPage, getStrategiesActiveTab } from '../../redux/selectors/ui'
import UIActions from '../../redux/actions/ui'

import StrategyEditor from './StrategyEditor'

const mapStateToProps = state => ({
  firstLogin: getFirstLogin(state),
  isGuideActive: getGuideStatusForPage(state, STRATEGY_PAGE),
  strategyId: state.ui.id,
  strategyContent: state.ui.content,
  selectedTab: getStrategiesActiveTab(state),
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
  setStrategyTab(tab) {
    dispatch(UIActions.setStrategyTab(tab))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(StrategyEditor)
