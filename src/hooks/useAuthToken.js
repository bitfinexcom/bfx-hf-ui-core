import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import { useLocation } from 'react-router'
import { isElectronApp } from '../redux/config'
import tokenStore from '../util/token_store'

export default () => {
  if (isElectronApp) {
    return
  }

  const dispatch = useDispatch()
  const location = useLocation()
  const authToken = new URLSearchParams(location.search).get('authToken')

  useEffect(() => {
    if (authToken) {
      tokenStore.set(decodeURIComponent(authToken))

      // remove authToken query from url
      dispatch(replace(location.pathname))
    } else {
      // trigger getting the token
      tokenStore.get()
    }
  }, [authToken, dispatch, location.pathname])
}
