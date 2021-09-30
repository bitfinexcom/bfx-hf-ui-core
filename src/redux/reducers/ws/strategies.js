import _keyBy from 'lodash/keyBy'
import _omit from 'lodash/omit'
import t from '../../constants/ws'

const getInitialState = () => {
  return {}
}

export default function (state = getInitialState(), action = {}) {
  const { type, payload = [] } = action

  switch (type) {
    case t.DATA_STRATEGY: {
      const { strategy } = payload
      return {
        ...state,
        [strategy?.id]: strategy,
      }
    }
    case t.DATA_REMOVE_STRATEGY: {
      const { id } = payload

      return _omit(state, id)
    }

    case t.DATA_STRATEGIES: {
      const { strategies } = payload
      return _keyBy(strategies, s => s?.id)
    }

    case t.DEAUTH: {
      return getInitialState()
    }

    default: {
      return state
    }
  }
}
