import types from '../constants/ui'

export const setUIValue = (key, value) => ({
  type: types.SET_UI_VALUE,
  payload: {
    key, value,
  },
})

export const updateUIValue = (key, value) => ({
  type: types.UPDATE_UI_VALUE,
  payload: {
    key, value,
  },
})

export const saveLayout = () => ({
  type: types.SAVE_LAYOUT,
})

export const selectLayout = (id, routePath) => ({
  type: types.SELECT_LAYOUT,
  payload: {
    id,
    routePath,
  },
})

export const createLayout = (id) => ({
  type: types.CREATE_LAYOUT,
  payload: {
    id,
  },
})

export const deleteLayout = (id) => ({
  type: types.DELETE_LAYOUT,
  payload: {
    id,
  },
})

export const setActiveMarket = (market) => ({
  type: types.SET_ACTIVE_MARKET,
  payload: {
    market,
  },
})

export const saveComponentState = ({ layoutID, componentID, state }) => ({
  type: types.SAVE_COMPONENT_STATE,
  payload: {
    state,
    layoutID,
    componentID,
  },
})

export const updateComponentState = ({ layoutID, componentID, state }) => ({
  type: types.UPDATE_COMPONENT_STATE,
  payload: {
    layoutID,
    componentID,
    state,
  },
})

export const removeNotification = (cid) => ({
  type: types.REMOVE_NOTIFICATION,
  payload: {
    cid,
  },
})

export const removeNotifications = (cids) => ({
  type: types.REMOVE_NOTIFICATIONS,
  payload: {
    cids,
  },
})

export const clearNotifications = () => ({
  type: types.CLEAR_NOTIFICATIONS,
})

export const recvNotification = (notification) => ({
  type: types.DATA_NOTIFICATION,
  payload: { notification },
})

export const setStrategyExecutionId = (execId) => ({
  type: types.SET_STRATEGY_EXECUTION_ID,
  payload: { executionId: execId },
})

export const setCurrentStrategy = strategy => ({
  type: types.SET_CURRENT_STRATEGY,
  payload: { strategy },
})

export const setIsStrategyDirty = isStrategyDirty => ({
  type: types.SET_IS_STRATEGY_DIRTY,
  payload: { isStrategyDirty },
})

export const setTradingMode = (isPaperTrading) => ({
  type: types.SET_TRADING_MODE,
  payload: { isPaperTrading },
})

export const setMarketFromStore = (isPaperTrading) => ({
  type: types.SET_MARKET_FROM_STORE,
  payload: { isPaperTrading },
})

export const addComponent = (component) => ({
  type: types.ADD_COMPONENT,
  payload: { component },
})

export const removeComponent = (i) => ({
  type: types.REMOVE_COMPONENT,
  payload: { i },
})

export const changeLayout = (incomingLayout) => ({
  type: types.CHANGE_LAYOUT,
  payload: { incomingLayout },
})

export const changeTickersVolumeUnit = (key) => ({
  type: types.CHANGE_TICKERS_VOLUME_UNIT,
  payload: { key },
})

export const setSettingsTab = (tab, section) => ({
  type: types.SET_SETTINGS_TAB,
  payload: { tab, section },
})

export const updateServiceStatus = (mode, serviceStatus) => ({
  type: types.UPDATE_SERVICE_STATUS,
  payload: {
    mode,
    serviceStatus,
  },
})

export const changeMode = (isPaperTrading) => ({
  type: types.CHANGE_MODE,
  payload: {
    isPaperTrading,
  },
})

export const changeUIModalState = (key, isOpen) => ({
  type: types.CHANGE_UI_MODAL_STATE,
  payload: { key, isOpen },
})

export const toggleUIModalState = (key) => ({
  type: types.TOGGLE_UI_MODAL_STATE,
  payload: { key },
})

export const removeStrategy = (authToken, id) => ({
  type: types.REMOVE_STRATEGY,
  payload: { authToken, id },
})

export default {
  setUIValue,
  updateUIValue,
  saveLayout,
  createLayout,
  deleteLayout,
  setActiveMarket,
  saveComponentState,
  updateComponentState,
  removeNotification,
  removeNotifications,
  clearNotifications,
  recvNotification,
  setStrategyExecutionId,
  setTradingMode,
  setMarketFromStore,
  changeTickersVolumeUnit,
  setSettingsTab,
  updateServiceStatus,
  changeMode,
  changeUIModalState,
  toggleUIModalState,
  removeStrategy,
  setCurrentStrategy,
  setIsStrategyDirty,
}
