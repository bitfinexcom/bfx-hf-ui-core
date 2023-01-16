import React, { memo } from 'react'

import { useDispatch } from 'react-redux'
import { changeUIModalState } from '../../redux/actions/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import NavbarButton from './Navbar.Button'

const AppSettings = () => {
  const dispatch = useDispatch()
  const onOpenAppSettingsModal = () => dispatch(changeUIModalState(UI_MODAL_KEYS.APP_SETTINGS_MODAL, true))

  return (
    <div className='hfui-navbar__app-settings'>
      <NavbarButton
        alt='Application settings'
        icon='settings-icon'
        className='hfui-navbar__app-settings__icon'
        onClick={onOpenAppSettingsModal}
      />
    </div>
  )
}

export default memo(AppSettings)
