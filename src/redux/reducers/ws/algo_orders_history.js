import _forEach from 'lodash/forEach'
import _omit from 'lodash/omit'
import t from '../../constants/ws'

const getInitialState = () => ({
  main: {},
  paper: {},
  isLoaded: false,
})

export default (state = getInitialState(), action = {}) => {
  const { type, payload = {} } = action

  switch (type) {
    case t.DATA_ALGO_ORDERS_HISTORY: {
      const { aos, mode } = payload

      const transformed = {}
      _forEach(aos, (ao) => {
        transformed[ao?.gid] = ao
      })

      return {
        ...state,
        [mode]: transformed,
        isLoaded: true,
      }
    }

    case t.SET_ALGO_ORDER_TO_HISTORY: {
      const { stoppedAO, mode } = payload
      const { gid } = stoppedAO

      const newState = {
        ...state,
        [mode]: {
          ...state[mode],
          [gid]: stoppedAO,
        },
      }

      return newState
    }

    case t.REMOVE_ALGO_ORDER_FROM_HISTORY: {
      const { gid, mode } = payload

      return {
        ...state,
        [mode]: _omit(state[mode], gid),
      }
    }

    default: {
      return state
    }
  }
}
