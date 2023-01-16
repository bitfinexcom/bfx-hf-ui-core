import React from 'react'
import PropTypes from 'prop-types'

const PanelIconButton = ({ onClick, icon }) => {
  return (
    <button className='hfui-panel__icon-button' onClick={onClick} type='button'>
      {icon}
    </button>
  )
}

PanelIconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
}

export default PanelIconButton
