import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const PanelButton = ({
  icon, text, onClick, isActive: active,
}) => {
  return (
    <button
      className={clsx('hfui-panel__button', { active })}
      type='button'
      onClick={onClick}
    >
      {icon && icon}
      <p>{text}</p>
    </button>
  )
}

PanelButton.propTypes = {
  icon: PropTypes.node,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
}

PanelButton.defaultProps = {
  icon: null,
  isActive: true,
}

export default PanelButton
