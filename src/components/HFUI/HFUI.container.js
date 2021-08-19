import { connect } from 'react-redux'
import { reduxActions } from '@ufx-ui/bfx-containers'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import { getCurrentMode, getShowAlgoPauseInfoSetting } from '../../redux/selectors/ui'
import { getAuthToken } from '../../redux/selectors/ws'
import HFUI from './HFUI'

const mapStateToProps = (state = {}) => {
  const { ui } = state
  const { notificationsVisible } = ui

  return {
    authToken: getAuthToken(state),
    notificationsVisible,
    currentMode: getCurrentMode(state),
    settingsShowAlgoPauseInfo: getShowAlgoPauseInfoSetting(state),
  }
}

const mapDispatchToProps = dispatch => ({
  getSettings: () => {
    dispatch(WSActions.send(['settings.get']))
  },
  GAPageview: (page) => {
    dispatch(GAActions.pageview(page))
  },
  getFavoritePairs: (mode) => {
    dispatch(WSActions.send([
      'favourite_trading_pairs.get',
      mode,
    ]))
  },
  onUnload: (authToken, mode) => {
    dispatch(WSActions.onUnload(authToken, mode))
  },
  subscribeAllTickers: () => {
    dispatch(reduxActions.fetchAllTickersPeriodically())
  },
  shouldShowAOPauseModalState: () => {
    dispatch(WSActions.send(['get.show_algo_pause_info']))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(HFUI)
