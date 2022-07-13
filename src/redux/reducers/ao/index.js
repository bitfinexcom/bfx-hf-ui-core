import _filter from 'lodash/filter'
import types from '../../constants/ao'

function getInitialState() {
  return {
    showActiveAlgoModal: false,
    activeAOParamsID: null,
    aoParams: {}, // { symbol: { algoID: [/* data */] } }
  }
}

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = [] } = action

  switch (type) {
    case types.SET_ACTIVE_AOS: {
      const { activeAlgoOrders, mode } = payload
      return {
        ...state,
        activeAlgoOrders,
        algoOrderTable: {
          ...state.algoOrderTable || {},
          [mode]: {
            isInitialFetch: false,
          },
        },
      }
    }

    case types.SHOW_ACTIVE_AOS_MODAL: {
      return {
        ...state,
        showActiveAlgoModal: payload,
      }
    }

    case types.SET_AO_PARAMS: {
      const { algoID, symbol, data } = payload

      return {
        ...state,
        aoParams: {
          ...state.aoParams,
          [symbol]: {
            ...state.aoParams?.[symbol],
            [algoID]: data,
          },
        },
      }
    }

    case types.APPEND_AO_PARAMS: {
      const { algoID, symbol, data } = payload

      return {
        ...state,
        aoParams: {
          ...state.aoParams,
          [symbol]: {
            ...state.aoParams?.[symbol],
            [algoID]: [...(state.aoParams?.[symbol]?.[algoID] || []), data],
          },
        },
      }
    }

    case types.SET_ACTIVE_AO_PARAMS_ID: {
      const { id } = payload

      return {
        ...state,
        activeAOParamsID: id,
      }
    }

    case types.REMOVE_AO_PARAMS: {
      const { algoID, symbol, id } = payload

      return {
        ...state,
        aoParams: {
          ...state.aoParams,
          [symbol]: {
            ...state.aoParams?.[symbol],
            [algoID]: _filter(state.aoParams?.[symbol]?.[algoID], (p) => p?.id !== id),
          },
        },
      }
    }

    default: {
      return state
    }
  }
}

export default reducer
