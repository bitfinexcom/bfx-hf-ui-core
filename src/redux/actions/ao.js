import types from '../constants/ao'

export function handleActiveAlgoOrders(payload) {
  return {
    type: types.HANDLE_ACTIVE_AOS,
    payload,
  }
}

export function setActiveAlgoOrders(activeAlgoOrders, mode, isAfterLogin) {
  return {
    type: types.SET_ACTIVE_AOS,
    payload: {
      activeAlgoOrders,
      isAfterLogin,
      mode,
    },
  }
}

export function showActiveOrdersModal(status) {
  return {
    type: types.SHOW_ACTIVE_AOS_MODAL,
    payload: status,
  }
}

export function resumeRemoveActiveAlgoOrders(data) {
  return {
    type: types.RESUME_REMOVE_ACTIVE_AOS,
    payload: data,
  }
}

export function getAlgoOrderParams(algoID, symbol) {
  return {
    type: types.GET_AO_PARAMS,
    payload: {
      algoID, symbol,
    },
  }
}

export function setAlgoOrderParams(algoID, symbol, data) {
  return {
    type: types.SET_AO_PARAMS,
    payload: {
      algoID, symbol, data,
    },
  }
}

export function appendAlgoOrderParams(algoID, symbol, data) {
  return {
    type: types.APPEND_AO_PARAMS,
    payload: {
      algoID, symbol, data,
    },
  }
}

export function saveAlgoOrderParams(data) {
  return {
    type: types.SAVE_AO_PARAMS,
    payload: {
      data,
    },
  }
}

export function removeAlgoOrderParams(algoID, symbol, id) {
  return {
    type: types.REMOVE_AO_PARAMS,
    payload: {
      algoID, symbol, id,
    },
  }
}

export function setActiveAOParamsID(id) {
  return {
    type: types.SET_ACTIVE_AO_PARAMS_ID,
    payload: {
      id,
    },
  }
}

export function setShowAOsHistory(showAOsHistory) {
  return {
    type: types.SHOW_AOS_HISTORY,
    payload: {
      showAOsHistory,
    },
  }
}

export function recvRecurringAoAtomics(orders, gid, mode) {
  return {
    type: types.DATA_RECURRING_AO_ATOMICS,
    payload: { orders, gid, mode },
  }
}

export function recvRecurringAoAtomicsFailed(gid) {
  return {
    type: types.GET_RECURRING_AO_ATOMICS_FAILED,
    payload: { gid },
  }
}

export function requestRecurringAoAtomics(payload) {
  return {
    type: types.REQUEST_RECURRING_AO_ATOMICS,
    payload,
  }
}

export function setFailedRecurringAoAtomics(orders) {
  return {
    type: types.SET_FAILED_RECURRING_AO_ATOMICS,
    payload: { orders },
  }
}

export default {
  setActiveAlgoOrders,
  showActiveOrdersModal,
  handleActiveAlgoOrders,
  getAlgoOrderParams,
  setAlgoOrderParams,
  removeAlgoOrderParams,
  saveAlgoOrderParams,
  setActiveAOParamsID,
  appendAlgoOrderParams,
  setShowAOsHistory,
  recvRecurringAoAtomics,
  setFailedRecurringAoAtomics,
  recvRecurringAoAtomicsFailed,
  requestRecurringAoAtomics,
}
