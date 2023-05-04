import { connect } from 'react-redux'
import { reduxActions } from '@ufx-ui/bfx-containers'
import { v4 as uuidv4 } from 'uuid'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import UIActions from '../../redux/actions/ui'
import {
  getCurrentMode,
  getShowAlgoPauseInfoSetting,
  getThemeSetting,
  getIsBetaVersion,
  getIsStrategiesTabVisible,
  SETTINGS_KEYS,
  getIsFullscreen,
} from '../../redux/selectors/ui'
import { MAX_ORDER_COUNT_SETTING } from '../../redux/selectors/ui/get_core_settings'
import { getAuthToken, getIsBitfinexConnected } from '../../redux/selectors/ws'

import HFUI from './HFUI'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import { LOG_LEVELS } from '../../constants/logging'

const mapStateToProps = (state = {}) => {
  const { ui } = state
  const { isNotificationsPanelOpen } = ui?.modals

  return {
    authToken: getAuthToken(state),
    notificationsVisible: isNotificationsPanelOpen,
    currentMode: getCurrentMode(state),
    settingsShowAlgoPauseInfo: getShowAlgoPauseInfoSetting(state),
    settingsTheme: getThemeSetting(state),
    isBfxConnected: getIsBitfinexConnected(state),
    showStrategies: getIsBetaVersion(state) || getIsStrategiesTabVisible(state),
    isFullscreen: getIsFullscreen(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  getSettings: (authToken) => {
    dispatch(WSActions.send(['get.settings', authToken]))
  },
  getPastStrategies: (authToken) => {
    dispatch(WSActions.send(['get.past_strategies', authToken]))
  },
  getCoreSettings: (authToken) => {
    dispatch(
      WSActions.send([
        'get.core_settings',
        authToken,
        [MAX_ORDER_COUNT_SETTING],
      ]),
    )
  },
  GAPageview: (page) => {
    dispatch(GAActions.pageview(page))
  },
  getFavoritePairs: (authToken, mode) => {
    dispatch(WSActions.send(['get.favourite_trading_pairs', authToken, mode]))
  },
  onUnload: (authToken, mode) => {
    dispatch(WSActions.onUnload(authToken, mode))
  },
  subscribeAllTickers: () => {
    dispatch(UIActions.logInformation(null, LOG_LEVELS.DEBUG, 'market_data_fetch'))
    dispatch(reduxActions.fetchAllTickersPeriodically())
  },
  shouldShowAOPauseModalState: () => {
    dispatch(WSActions.send(['get.show_algo_pause_info']))
  },
  getFeatureFlags: (authToken) => {
    dispatch(WSActions.send(['feature_flags.get', authToken]))
  },
  openAppSettingsModal: () => {
    dispatch(
      UIActions.changeUIModalState(UI_MODAL_KEYS.APP_SETTINGS_MODAL, true),
    )
  },
  setApplicationHiddenStatus: (isHidden, message = '') => {
    dispatch(UIActions.setUIValue(UI_KEYS.isApplicationHidden, isHidden))
    if (isHidden) {
      dispatch(
        UIActions.recvNotification({
          mts: Date.now(),
          status: 'info',
          text: message,
          cid: uuidv4(),
        }),
      )
    }
  },
  updateFullscreenState: (fullscreen) => {
    dispatch(UIActions.setUIValue(UI_KEYS.isFullscreenBarShown, fullscreen))
    dispatch(WSActions.saveSetting(SETTINGS_KEYS.FULLSCREEN, fullscreen))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(HFUI)
