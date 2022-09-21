import React from 'react'
import PropTypes from 'prop-types'
import cx from 'clsx'

const SidebarParam = ({
  isSelected, isDisabled, children, onClick, ...props
}) => (
  <div
    className={cx('hfui-orderform__ao-settings__item is-layout', {
      'is-selected': isSelected,
      'is-disabled': isDisabled,
    })}
    onClick={isDisabled ? () => {} : onClick}
    {...props}
  >
    {children}
  </div>
)

SidebarParam.propTypes = {
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
}

SidebarParam.defaultProps = {
  isSelected: false,
  isDisabled: false,
}

export default SidebarParam
