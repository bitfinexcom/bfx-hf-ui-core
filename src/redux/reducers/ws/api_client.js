import t, { WS_CONNECTION } from '../../constants/ws'
import { PAPER_MODE } from '../ui'

const getInitialState = () => {
  return {
    sandbox: WS_CONNECTION.CLOSED,
    main: WS_CONNECTION.CLOSED,
  }
}

export default function (state = getInitialState(), action = {}) {
  const { type, payload = {} } = action

  switch (type) {
    case t.DATA_CLIENT_STATUS_UPDATE: {
      const { status, mode } = payload

      return {
        ...state,
        [mode === PAPER_MODE ? 'sandbox' : 'main']: status,
      }
    }

    case t.DEAUTH: {
      return getInitialState()
    }

    default: {
      return state
    }
  }
}
