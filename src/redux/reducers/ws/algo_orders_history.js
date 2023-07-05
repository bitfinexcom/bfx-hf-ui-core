import _reduce from 'lodash/reduce'
import _get from 'lodash/get'
import t from '../../constants/ws'
import { getIsPaperPair } from '../../../util/market'

const getInitialState = () => ({
  main: {},
  paper: {},
  isLoaded: false,
})

export default (state = getInitialState(), action = {}) => {
  const { type, payload = {} } = action

  switch (type) {
    case t.DATA_ALGO_ORDERS_HISTORY: {
      const newState = _reduce(payload, (acc, ao) => {
        const { gid, state: _state } = ao
        try {
          const parsedState = JSON.parse(_state)
          const newAOobject = {
            ...ao,
            ...parsedState,
          }
          delete newAOobject.state

          const symbol = _get(newAOobject, 'args.symbol', null)
          if (!symbol) {
            // invalid order
            return acc
          }
          const isPaperPair = getIsPaperPair(symbol)
          acc[isPaperPair ? 'paper' : 'main'][gid] = newAOobject

          return acc
        } catch {
          return acc
        }
      }, getInitialState())

      newState.isLoaded = true
      return newState
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

    default: {
      return state
    }
  }
}
