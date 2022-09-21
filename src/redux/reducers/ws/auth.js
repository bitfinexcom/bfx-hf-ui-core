import t from '../../constants/ws'
import { getAuthToken } from '../../../util/token_store'
import { MAIN_MODE, PAPER_MODE } from '../ui'

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

    case t.DATA_API_CREDENTIALS_CONFIGURED: {
      const { state: apiKeysState } = payload
      return {
        ...state,
        apiKeys: { ...apiKeysState },
      }
    }

    case t.UPDATE_API_CREDENTIALS_CONFIGURED: {
      const { mode } = payload

      return {
        ...state,
        apiKeys: {
          ...(state.apiKeys || {}),
          [mode]: {
            configured: false,
            valid: false,
          },
        },
        isMainModeApiKeyUpdating: false,
        isPaperModeApiKeyUpdating: false,
      }
    }

    case t.UPDATING_API_KEY: {
      const { mode, isUpdating } = payload
      return {
        ...state,
        isMainModeApiKeyUpdating: mode === MAIN_MODE && isUpdating,
        isPaperModeApiKeyUpdating: mode === PAPER_MODE && isUpdating,
      }
    }

    case t.SET_USERNAME: {
      const { username } = payload

      return {
        ...state,
        username,
      }
    }

    // web auth token success
    case t.DATA_WEB_AUTH_SUCCESS: {
      const { userId } = payload

      return {
        ...state,
        userId,
        token: getAuthToken(),
        configured: true,
      }
    }

    default: {
      return state
    }
  }
}
