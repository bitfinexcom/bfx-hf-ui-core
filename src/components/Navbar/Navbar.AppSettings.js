import React, { memo } from 'react'

import { useDispatch } from 'react-redux'
import { changeAppSettingsModalState } from '../../redux/actions/ui'
import NavbarButton from './Navbar.Button'

const AppSettings = () => {
  const dispatch = useDispatch()
  const onOpenAppSettingsModal = () => dispatch(changeAppSettingsModalState(true))

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
