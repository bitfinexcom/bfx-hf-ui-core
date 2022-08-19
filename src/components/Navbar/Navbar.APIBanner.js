import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import BitfinexIcon from '../../ui/BitfinexIcon'
import {
  getIsPaperTrading,
  getThemeSetting,
  THEMES,
} from '../../redux/selectors/ui'
import {
  getMainAPIKeyState,
  getPaperAPIKeyState,
} from '../../redux/selectors/ws'
import { changeUIModalState, setSettingsTab } from '../../redux/actions/ui'
import { SETTINGS_TABS } from '../../modals/AppSettingsModal/AppSettingsModal.constants'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { MAIN_MODE, PAPER_MODE } from '../../redux/reducers/ui'

const APIBanner = () => {
  const settingsTheme = useSelector(getThemeSetting)
  const isPaperTrading = useSelector(getIsPaperTrading)
  const paperAPIKeyState = useSelector(getPaperAPIKeyState)
  const mainAPIKeyState = useSelector(getMainAPIKeyState)
  const isLoggedIn = isPaperTrading
    ? paperAPIKeyState.valid
    : mainAPIKeyState.valid

  const dispatch = useDispatch()

  const buttonHandler = () => {
    dispatch(
      setSettingsTab(
        SETTINGS_TABS.Keys,
        isPaperTrading ? PAPER_MODE : MAIN_MODE,
      ),
    )
    dispatch(changeUIModalState(UI_MODAL_KEYS.APP_SETTINGS_MODAL, true))
  }

  const { t } = useTranslation()
  return (
    <div className='hfui-navbar__api'>
      {isLoggedIn ? (
        <div className='logged-in-bar'>
          <p className='logged-in-bar__text'>
            <span>{t('navbar.loggedInAs')}</span>
            &nbsp;
            <span className='logged-in-bar__username'>@anybody</span>
          </p>
          <p onClick={buttonHandler} className='logged-in-bar__update-creds '>
            {t('navbar.updateCreds')}
          </p>
        </div>
      ) : (
        <button
          type='button'
          className='hfui-navbar__close-session hfui-exchangeinfobar__button'
          onClick={buttonHandler}
        >
          {t('navbar.signInTo')}
          &nbsp;&nbsp;
          <BitfinexIcon
            key='logo'
            fill={settingsTheme === THEMES.DARK ? 'white' : 'black'}
          />
        </button>
      )}
    </div>
  )
}

export default APIBanner
