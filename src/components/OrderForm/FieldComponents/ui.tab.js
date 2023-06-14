import React, { memo } from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'clsx'

const OrderFormTab = ({
  label, value, isActive, onClick,
}) => {
  return (
    <div
      onClick={() => onClick(value)}
      className={ClassNames('hfui__orderform-tab', { active: isActive })}
    >
      <p>{label}</p>
    </div>
  )
}

OrderFormTab.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

OrderFormTab.defaultProps = {
  isActive: false,
}

export default memo(OrderFormTab)
