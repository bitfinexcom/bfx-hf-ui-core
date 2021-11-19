import getComponentState from './get_component_state'
import getActiveMarket from './get_active_market'
import getLayouts from './get_layouts'
import getLayoutID from './get_layout_id'
import getRemoteVersion from './get_remote_version'
import getIsTradingModeModalVisible from './get_is_trading_mode_modal_visible'
import getIsBadInternetConnection from './get_is_bad_internet_connection'
import getIsAOPausedModalVisible from './get_is_ao_paused'
import getOldFormatModalState from './get_old_modal_format_state'
import getIsRefillBalanceModalVisible from './get_is_refill_balance_modal_visible'
import getIsPaperTrading from './get_is_paper_trading'
import getIsOrderExecuting from './get_is_order_executing'
import getFirstLogin from './get_first_login'
import getCurrentMode from './get_current_mode'
import getGuideStatusForPage from './get_guide_status_for_page'
import getStrategyId from './get_strategy_id'
import getMarketComponents from './get_market_components'
import getCurrentUnsavedLayout from './get_current_unsaved_layout'
import getTickersVolumeUnit from './get_tickers_volume_unit'
import getIsCcyInfoModalVisible from './get_is_ccy_info_modal_visible'
import getCurrentLanguage from './get_current_language'
import getIsAddNewParamModalVisible from './get_is_add_new_param_modal_visible'
import getIsAnyModalIsOpen from './get_is_any_modal_is_open'

export * from './get_settings'

export {
  getRemoteVersion,
  getComponentState,
  getActiveMarket,
  getLayouts,
  getLayoutID,
  getIsTradingModeModalVisible,
  getIsBadInternetConnection,
  getIsRefillBalanceModalVisible,
  getIsPaperTrading,
  getFirstLogin,
  getCurrentMode,
  getGuideStatusForPage,
  getStrategyId,
  getMarketComponents,
  getIsOrderExecuting,
  getCurrentUnsavedLayout,
  getTickersVolumeUnit,
  getOldFormatModalState,
  getIsAOPausedModalVisible,
  getIsCcyInfoModalVisible,
  getCurrentLanguage,
  getIsAddNewParamModalVisible,
  getIsAnyModalIsOpen,
}
