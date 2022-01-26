import _isString from 'lodash/isString'
import t from '../constants/ws'
import ui from '../constants/ui'
import { getScope } from '../../util/scope'

const send = payload => ({
  type: t.BUFF_SEND,
  payload: _isString(payload)
    ? payload
    : JSON.stringify(payload),
})

export default {
  send,
  error: payload => ({ type: t.ERROR, payload }),
  flushQueue: () => ({ type: t.FLUSH_QUEUE }),

  connect: (alias = '', destination = '') => ({
    type: t.CONNECT,
    payload: { alias, destination },
  }),

  connected: (alias) => ({ type: t.CONNECTED, payload: { alias } }),
  reconnected: (alias) => ({ type: t.RECONNECTED, payload: { alias } }),
  disconnected: (alias) => ({ type: t.DISCONNECTED, payload: { alias } }),
  disconnect: (alias) => ({ type: t.DISCONNECT, payload: { alias } }),

  setBacktestLoading: () => ({
    type: t.SET_BACKTEST_LOADING,
    payload: {},
  }),

  recvDataMarkets: (markets) => ({
    type: t.DATA_MARKETS,
    payload: { markets },
  }),

  recvUpdatedSettings: settings => ({
    type: ui.UPDATE_SETTINGS,
    payload: settings,
  }),

  saveSettings: (key, value) => ({
    type: ui.SAVE_SETTINGS,
    payload: {
      key,
      value,
    },
  }),

  recvCoreSettings: settings => ({
    type: ui.RECEIVE_CORE_SETTINGS,
    payload: settings,
  }),

  bufferDataFromExchange: (
    chanID, data, rawData = null,
  ) => ({
    type: t.BUFFER_DATA_FROM_EXCHANGE,
    payload: {
      chanID,
      data,
      rawData,
    },
  }),

  recvDataSyncStart: ({
    symbol, tf, start, end,
  }) => ({
    type: t.DATA_SYNC_START,
    payload: {
      symbol, tf, start, end,
    },
  }),

  recvDataSyncEnd: ({
    symbol, tf, start, end,
  }) => ({
    type: t.DATA_SYNC_END,
    payload: {
      symbol, tf, start, end,
    },
  }),

  recvStrategy: ({ id, strategy }) => ({
    type: t.DATA_STRATEGY,
    payload: { id, strategy },
  }),

  recvRemovedStrategy: (id) => ({
    type: t.DATA_REMOVE_STRATEGY,
    payload: { id },
  }),

  recvStrategies: ({ strategies }) => ({
    type: t.DATA_STRATEGIES,
    payload: { strategies },
  }),

  recvAPICredentialsConfigured: (state) => ({
    type: t.DATA_API_CREDENTIALS_CONFIGURED,
    payload: { state },
  }),

  recvClientStatusUpdate: ({ status }) => ({
    type: t.DATA_CLIENT_STATUS_UPDATE,
    payload: { status },
  }),

  recvPositions: ({ positions }) => ({
    type: t.DATA_POSITIONS,
    payload: { positions },
  }),

  recvPosition: ({ position }) => ({
    type: t.DATA_POSITION,
    payload: { position },
  }),

  recvPositionClose: ({ position }) => ({
    type: t.DATA_POSITION_CLOSE,
    payload: { position },
  }),

  recvBalances: ({ balances }) => ({
    type: t.DATA_BALANCES,
    payload: { balances },
  }),

  recvBalance: ({ balance }) => ({
    type: t.DATA_BALANCE,
    payload: { balance },
  }),

  setBalances: (balances) => ({
    type: t.SET_BALANCES,
    payload: { balances },
  }),

  setBalance: (balance) => ({
    type: t.SET_BALANCE,
    payload: { balance },
  }),

  recvOrders: ({ orders }) => ({
    type: t.DATA_ORDERS,
    payload: { orders },
  }),

  recvOrder: ({ order }) => ({
    type: t.DATA_ORDER,
    payload: { order },
  }),

  recvOrderClose: ({ order }) => ({
    type: t.DATA_ORDER_CLOSE_ASYNC,
    payload: { order },
  }),

  setOrderClose: ({ order }) => ({
    type: t.DATA_ORDER_CLOSE,
    payload: { order },
  }),

  recvDataAlgoOrder: ({ ao }) => ({
    type: t.DATA_ALGO_ORDER,
    payload: { ao },
  }),

  recvDataAlgoOrderStopped: ({ gid }) => ({
    type: t.DATA_ALGO_ORDER_STOPPED,
    payload: { gid },
  }),

  recvDataAlgoOrders: ({ aos }) => ({
    type: t.DATA_ALGO_ORDERS,
    payload: { aos },
  }),

  clearAlgoOrders: () => ({
    type: t.CLEAR_ALGO_ORDERS,
  }),

  recvNotification: notification => ({
    type: t.DATA_NOTIFICATION,
    payload: { notification },
  }),

  recvAuthConfigured: configured => ({
    type: t.DATA_AUTH_CONFIGURED,
    payload: { configured },
  }),

  recvAuthToken: token => ({
    type: t.DATA_AUTH_TOKEN,
    payload: { token },
  }),

  recvBacktestStart: opts => ({
    type: t.BACKTEST_START,
    payload: opts,
  }),

  recvBacktestEnd: opts => ({
    type: t.BACKTEST_END,
    payload: opts,
  }),

  recvBacktestResults: opts => ({
    type: t.BACKTEST_RESULTS,
    payload: opts,
  }),

  recvBacktestCandle: candle => ({
    type: t.BACKTEST_CANDLE,
    payload: candle,
  }),

  recvBacktestTrade: trade => ({
    type: t.BACKTEST_TRADE,
    payload: trade,
  }),

  recvBacktestExecute: opts => ({
    type: t.BACKTEST_EXECUTE,
    payload: opts,
  }),

  recvUpdatedFavoritePairs: pairs => ({
    type: t.UPDATE_FAVORITE_PAIRS,
    payload: pairs,
  }),

  recvUserId: userId => ({
    type: t.DATA_WEB_AUTH_SUCCESS,
    payload: {
      userId,
    },
  }),

  purgeDataBook: (channel) => ({
    type: t.PURGE_DATA_BOOK,
    payload: { channel },
  }),

  setBacktestOptions: options => ({
    type: t.SET_BACKTEST_OPTIONS,
    payload: { options },
  }),

  setExecutionOptions: options => ({
    type: t.SET_EXECUTION_OPTIONS,
    payload: { options },
  }),

  resetExecutionData: () => ({
    type: t.RESET_DATA_EXECUTION,
  }),

  startLiveExecution: () => ({
    type: t.EXECUTION_START,
  }),

  stopLiveExecution: () => ({
    type: t.EXECUTION_STOP,
  }),

  setExecutionLoading: (loading) => ({
    type: t.EXECUTION_LOADING,
    payload: { loading },
  }),

  setExecutionResults: (results) => ({
    type: t.SET_EXECUTION_RESULTS,
    payload: { results },
  }),

  purgeBacktestData: () => ({
    type: t.PURGE_DATA_BACKTEST,
  }),
  resetBacktestData: () => ({
    type: t.RESET_DATA_BACKTEST,
  }),
  updatingApiKey: (mode, isUpdating) => ({
    type: t.UPDATING_API_KEY,
    payload: { mode, isUpdating },
  }),
  initAuth: password => send(['auth.init', password, 'main', getScope()]),
  auth: (password, mode) => send(['auth.submit', password, mode, getScope()]),
  resetAuth: () => send(['auth.reset']),
  webAuth: token => send({ event: 'auth', token }),
  onUnload: (authToken, mode) => send(['algo_order.pause', authToken, mode]),

  submitAlgoOrder: (authToken, id, args) => send([
    'algo_order.submit',
    authToken,
    'bitfinex',
    id,
    {
      ...args,
      meta: {
        ...(args.meta || {}),
        scope: getScope(),
      },
    },
  ]),

  submitOrder: (authToken, args) => send([
    'order.submit',
    authToken,
    'bitfinex',
    {
      ...args,
      meta: {
        ...(args.meta || {}),
        scope: getScope(),
      },
    },
  ]),
}
