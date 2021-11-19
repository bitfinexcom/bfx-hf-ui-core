import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavbarButton from './Navbar.Button'

import AppSettingsModal from '../../modals/AppSettingsModal'
import { getIsAppSettingsModalVisible } from '../../redux/selectors/ui'
import { changeAppSettingsModalState } from '../../redux/actions/ui'

export default function AppSettings() {
  const isOpen = useSelector(getIsAppSettingsModalVisible)

  const dispatch = useDispatch()

  const closeModal = () => dispatch(changeAppSettingsModalState(false))

  const openModal = () => dispatch(changeAppSettingsModalState(true))

  return (
    <div className='hfui-navbar__app-settings'>
      <NavbarButton
        alt='Application settings'
        icon='settings-icon'
        className='hfui-navbar__app-settings__icon'
        onClick={openModal}
      />
      <AppSettingsModal
        isOpen={isOpen}
        onClose={closeModal}
      />
    </div>
  )
}
