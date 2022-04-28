import { connect } from 'react-redux'
import { reduxActions } from '@ufx-ui/bfx-containers'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import {
  getCurrentMode, getShowAlgoPauseInfoSetting, getThemeSetting, getIsBetaVersion, getIsStrategiesTabVisible,
} from '../../redux/selectors/ui'
import { MAX_ORDER_COUNT_SETTING } from '../../redux/selectors/ui/get_core_settings'
import { getAuthToken, getIsBitfinexConnected } from '../../redux/selectors/ws'

import HFUI from './HFUI'

const mapStateToProps = (state = {}) => {
  const { ui } = state
  const { notificationsVisible } = ui

  return {
    authToken: getAuthToken(state),
    notificationsVisible,
    currentMode: getCurrentMode(state),
    settingsShowAlgoPauseInfo: getShowAlgoPauseInfoSetting(state),
    settingsTheme: getThemeSetting(state),
    isBfxConnected: getIsBitfinexConnected(state),
    showStrategies: getIsBetaVersion(state) || getIsStrategiesTabVisible(state),
  }
}

const mapDispatchToProps = dispatch => ({
  getSettings: (authToken) => {
    dispatch(WSActions.send(['get.settings', authToken]))
  },
  getCoreSettings: (authToken) => {
    dispatch(WSActions.send(['get.core_settings', authToken, [MAX_ORDER_COUNT_SETTING]]))
  },
  GAPageview: (page) => {
    dispatch(GAActions.pageview(page))
  },
  getFavoritePairs: (authToken, mode) => {
    dispatch(WSActions.send([
      'get.favourite_trading_pairs',
      authToken,
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
  getFeatureFlags: (authToken) => {
    dispatch(WSActions.send(['feature_flags.get', authToken]))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(HFUI)
