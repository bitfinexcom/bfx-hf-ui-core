import _omit from 'lodash/omit'
import _forEach from 'lodash/forEach'

import types from '../../constants/ws'

const getInitialState = () => {
  return {
    main: {},
    paper: {},
  }
}

export default (state = getInitialState(), action = {}) => {
  const { type, payload = [] } = action

  switch (type) {
    case types.DATA_ALGO_ORDERS: {
      const { aos, mode } = payload
      const transformed = {}
      _forEach(aos, (ao) => {
        transformed[ao?.gid] = ao
      })

      return {
        ...state,
        [mode]: transformed,
      }
    }

    case types.DATA_ALGO_ORDER: {
      const { ao, mode } = payload

      return {
        ...state,
        [mode]: {
          ...(state[mode] || {}),
          [ao?.gid]: ao,
        },
      }
    }

    case types.DATA_ALGO_ORDER_STOPPED: {
      const { gid, mode } = payload

      return {
        ...state,
        [mode]: _omit(state[mode] || {}, gid),
      }
    }

    case types.CLEAR_ALGO_ORDERS:
    case types.DEAUTH: {
      return getInitialState()
    }

    default: {
      return state
    }
  }
}
