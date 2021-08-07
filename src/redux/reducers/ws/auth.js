import t from '../../constants/ws'

const getInitialState = () => {
  return {}
}

export default function (state = getInitialState(), action = {}) {
  const { type, payload = [] } = action
  switch (type) {
    case t.DATA_AUTH_CONFIGURED: {
      const { configured } = payload
      return {
        ...state,
        configured,
      }
    }

    case t.DATA_AUTH_TOKEN: {
      const { token } = payload
      return {
        ...state,
        token,
      }
    }

    case t.AUTH_API_FAILED: {
      const { status } = payload
      return {
        ...state,
        isWrongAPIKeys: status,
      }
    }

    case t.DATA_API_CREDENTIALS_CONFIGURED: {
      const { state: apiKeysState } = payload
      return {
        ...state,
        apiKeys: {
          isMainConfigured: apiKeysState.main,
          isPaperConfigured: apiKeysState.paper,
        },
      }
    }

    default: {
      return state
    }
  }
}
