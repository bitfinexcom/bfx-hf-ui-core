import {
  FETCH_AUTH_TOKEN,
  FETCH_AUTH_TOKEN_SUCCESS,
  FETCH_AUTH_TOKEN_FAIL,
  FETCH_AUTH_TOKEN_ATTEMPTED,
  SET_AUTH_TOKEN_INVALID,
} from '../constants/authToken.constants'

export const fetchToken = () => ({
  type: FETCH_AUTH_TOKEN,
})

export const fetchTokenSuccess = (token = '') => ({
  type: FETCH_AUTH_TOKEN_SUCCESS,
  payload: { token },
})

export const fetchTokenAttempted = () => ({
  type: FETCH_AUTH_TOKEN_ATTEMPTED,
})

export const fetchTokenFail = (error) => ({
  type: FETCH_AUTH_TOKEN_FAIL,
  payload: { error },
})

export function setTokenInvalid(payload) {
  return { type: SET_AUTH_TOKEN_INVALID, payload }
}
