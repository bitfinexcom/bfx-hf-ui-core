/* eslint-disable no-restricted-globals */
import React from 'react'
import { useDispatch } from 'react-redux'
import { BFX_TOKEN_COOKIE } from '../../constants/cookies'

import WSActions from '../../redux/actions/ws'
import { removeCookie } from '../../util/cookies'

const propTypes = {}

const defaultProps = {}

const homeUrl = process.env.REACT_APP_ENVIRONMENT === 'staging' ? 'https://bfx-ui-api.staging.bitfinex.com/' : 'https://honey.bitfinex.com'

export default function NavbarLogout() {
  const dispatch = useDispatch()

  const logout = () => {
    dispatch(WSActions.send([
      'auth.logout',
    ]))
    removeCookie(BFX_TOKEN_COOKIE)
    setTimeout(() => {
      // eslint-disable-next-line lodash/prefer-lodash-method
      location.replace(homeUrl)
    }, 1000)
  }

  return (
    <button
      type='button'
      className='hfui-navbar__logout hfui-exchangeinfobar__button'
      onClick={logout}
    >
      Logout
    </button>
  )
}

NavbarLogout.propTypes = propTypes
NavbarLogout.defaultProps = defaultProps
