/* eslint-disable no-restricted-globals */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { BFX_TOKEN_COOKIE } from '../../constants/cookies'

import WSActions from '../../redux/actions/ws'
import { isElectronApp } from '../../redux/config'
import { removeCookie } from '../../util/cookies'

const homeUrl = process.env.REACT_APP_ENVIRONMENT === 'staging'
  ? 'https://bfx-ui-api.staging.bitfinex.com/'
  : 'https://honey.bitfinex.com'

const CloseSessionButton = () => {
  const dispatch = useDispatch()

  const { t } = useTranslation()

  const logout = () => {
    dispatch(WSActions.send(['auth.logout']))
    removeCookie(BFX_TOKEN_COOKIE)
    setTimeout(() => {
      // eslint-disable-next-line lodash/prefer-lodash-method
      location.replace(homeUrl)
    }, 1000)
  }

  const openCloseSessionModal = () => {}

  const buttonHandler = () => (isElectronApp ? openCloseSessionModal() : logout())

  return (
    <button
      type='button'
      className='hfui-navbar__close-session hfui-exchangeinfobar__button'
      onClick={buttonHandler}
    >
      {t(isElectronApp ? 'ui.closeSession' : 'ui.logout')}
    </button>
  )
}

export default CloseSessionButton
