import _omit from 'lodash/omit'
import _isEqual from 'lodash/isEqual'
import _forEach from 'lodash/forEach'

import types from '../../constants/ws'
import { positionAdapter } from '../../adapters/ws'

function getInitialState() {
  return {}
}

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = [] } = action

  switch (type) {
    case types.DATA_POSITIONS: {
      const { positions = [] } = payload
      const transformed = {}
      _forEach(positions, position => {
        const adapted = positionAdapter(position)
        transformed[adapted?.id] = adapted
      })

      return transformed
    }

    case types.DATA_POSITION: {
      const { position = [] } = payload
      const adapted = positionAdapter(position)

      const prevPosition = state?.[adapted?.id]
      if (_isEqual(adapted, prevPosition)) {
        return state
      }

      return {
        ...state,
        [adapted?.id]: adapted,
      }
    }

    case types.DATA_POSITION_CLOSE: {
      const { position = [] } = payload
      const adapted = positionAdapter(position)

      return _omit(state, adapted?.id)
    }

    case types.DEAUTH: {
      return getInitialState()
    }

    default: {
      return state
    }
  }
}

export default reducer
