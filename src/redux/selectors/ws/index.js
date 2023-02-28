import getFavoritePairs from './get_favorite_pairs'
import getFavoritePairsObject from './get_favorite_pairs_object'
import { getSocket, isSocketConnected } from './get_socket'
import getSockets from './get_sockets'
import getAuthToken from './get_auth_token'
import getIsBitfinexConnected from './get_is_bitfinex_connected'
import getAuthConfigured from './get_auth_configured'
import getSortedByTimeStrategies from './get_sorted_by_time_strategies'
import getSortedByTimeActiveStrategies from './get_sorted_by_time_active_strategies'
import sortedByTimePastStrategies from './get_sorted_by_time_past_strategies'
import getLiveExecutionResults from './get_live_execution_results'
import getAllPositions from './get_all_positions'
import getFilteredPositions from './get_filtered_positions'
import getFilteredPositionsCount from './get_filtered_positions_count'
import getAllBalances from './get_all_balances'
import getFilteredBalances from './get_filtered_balances'
import getAtomicOrders from './get_atomic_orders'
import getFilteredAtomicOrders from './get_filtered_atomic_orders'
import getFilteredAtomicOrdersCount from './get_filtered_atomic_orders_count'
import getFilteredAlgoOrders from './get_filtered_algo_orders'
import getFilteredAlgoOrdersCount from './get_filtered_algo_orders_count'
import {
  getCurrentModeAlgoOrders,
  getAllAlgoOrdersArray,
  getCurrentModeActiveAlgoOrders,
} from './get_algo_orders'
import getNotifications from './get_notifications'
import getOrderHistory from './get_order_history'
import getCurrentStrategyOpenPositions from './get_current_strategy_open_positions'

import getBacktestState from './get_backtest_state'
import getBacktestData from './get_backtest_data'
import getBacktestResults from './get_backtest_results'

import {
  apiClientConnected,
  apiClientConnecting,
  apiClientDisconnected,
} from './api_client_state'

import getPaperAPIKeyState from './get_paper_api_key_state'
import getMainAPIKeyState from './get_main_api_key_state'
import getCurrentModeAPIKeyState, {
  getAPIKeyStates,
} from './get_current_mode_api_key_state'
import getIsMainModeApiKeyUpdating from './get_is_main_mode_api_key_updating'
import getIsPaperModeApiKeyUpdating from './get_is_paper_mode_api_key_updating'

import getSavedStrategies from './get_saved_strategies'
import getIsExecutionLoading from './get_is_execution_loading'
import getExecutionConnectionState from './get_execution_connection_state'
import getActiveStrategies from './get_active_strategies'
import getCurrentStrategyExecutionState from './get_current_strategy_execution_state'
import getCurrentStrategyPositions from './get_current_strategy_positions'
import getDraftStrategies from './get_draft_strategies'
import getUsername from './get_username'
import getAlgoOrdersHistory from './get_algo_orders_history'
import getIsAOsHistoryLoaded from './get_is_aos_history_loaded'
import getAlgoOrderById from './get_algo_order_by_id'

export {
  getSockets,
  getSocket,
  isSocketConnected,

  getAuthToken,
  getIsBitfinexConnected,
  getAuthConfigured,
  getOrderHistory,

  sortedByTimePastStrategies,
  getLiveExecutionResults,
  getSortedByTimeActiveStrategies,
  getSortedByTimeStrategies,
  getDraftStrategies,

  getBacktestState,
  getBacktestData,
  getBacktestResults,

  apiClientConnected,
  apiClientConnecting,
  apiClientDisconnected,

  getAllPositions,
  getFilteredPositions,
  getFilteredPositionsCount,
  getAllBalances,
  getFilteredBalances,
  getAtomicOrders,
  getFilteredAtomicOrders,
  getFilteredAtomicOrdersCount,
  getCurrentModeAlgoOrders,
  getCurrentModeActiveAlgoOrders,
  getAllAlgoOrdersArray,
  getFilteredAlgoOrders,
  getFilteredAlgoOrdersCount,
  getFavoritePairs,
  getFavoritePairsObject,

  getNotifications,

  getPaperAPIKeyState,
  getMainAPIKeyState,
  getAPIKeyStates,
  getCurrentModeAPIKeyState,
  getIsMainModeApiKeyUpdating,
  getIsPaperModeApiKeyUpdating,
  getUsername,

  getSavedStrategies,
  getIsExecutionLoading,
  getExecutionConnectionState,
  getActiveStrategies,
  getCurrentStrategyExecutionState,
  getCurrentStrategyPositions,
  getCurrentStrategyOpenPositions,

  getIsAOsHistoryLoaded,
  getAlgoOrdersHistory,
  getAlgoOrderById,
}
