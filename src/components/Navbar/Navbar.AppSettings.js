import React, { useState, memo } from 'react'

import NavbarButton from './Navbar.Button'

import AppSettingsModal from '../../modals/AppSettingsModal'

const AppSettings = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='hfui-navbar__app-settings'>
      <NavbarButton
        alt='Application settings'
        icon='settings-icon'
        className='hfui-navbar__app-settings__icon'
        onClick={() => setIsOpen(true)}
      />
      <AppSettingsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  )
}

export default memo(AppSettings)
