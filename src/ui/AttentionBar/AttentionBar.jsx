import React from 'react'
import PropTypes from 'prop-types'
import cx from 'clsx'

import './style.css'

const AttentionBar = ({
  green, yellow, red, children, className,
}) => {
  return (
    <div
      className={cx('hfui-attention-bar', className, { red, green, yellow })}
    >
      {children}
    </div>
  )
}

AttentionBar.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  className: PropTypes.string,
  green: PropTypes.bool,
  yellow: PropTypes.bool,
  red: PropTypes.bool,
}

AttentionBar.defaultProps = {
  className: null,
  green: false,
  yellow: false,
  red: false,
}

export default AttentionBar
