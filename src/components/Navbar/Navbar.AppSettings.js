import React, { useState } from 'react'

import NavbarButton from './Navbar.Button'

import AppSettingsModal from '../../modals/AppSettingsModal'

export default function AppSettings() {
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
