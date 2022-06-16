import React, { useState, memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import NavbarButton from '../Navbar/Navbar.Button'

const StrategyOptionsButton = ({ onClick }) => {
  const [showLabel, setShowLabel] = useState(false)

  const { t } = useTranslation()

  return (
    <div
      onClick={onClick}
      className='hfui-navbar__app-settings__icon hfui-strategy-options__settings-btn item'
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      <NavbarButton alt='Application settings' icon='settings-icon' />
      {showLabel && <span>{t('strategyEditor.strategyOptionsBtn')}</span>}
    </div>
  )
}

StrategyOptionsButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default memo(StrategyOptionsButton)
