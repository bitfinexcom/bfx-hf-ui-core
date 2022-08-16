import React, { memo } from 'react'
import PropTypes from 'prop-types'
import cx from 'clsx'

import './style.css'

const SimpleDropdown = ({
  label, options, className,
}) => {
  return (
    <div className={cx('hfui-simpledropdown', className)}>
      <div className='simpledropdown-label'>
        {label}
      </div>
      <div className='simpledropdown-content'>
        {options}
      </div>
    </div>
  )
}

SimpleDropdown.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  options: PropTypes.arrayOf([PropTypes.node]).isRequired,
  className: PropTypes.string,
}

SimpleDropdown.defaultProps = {
  className: null,
}

export default memo(SimpleDropdown)
