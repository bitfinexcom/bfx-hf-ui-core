import React, { memo } from 'react'
import PropTypes from 'prop-types'
import cx from 'clsx'

import './style.css'

const CCYIcon = ({ ccy, small, className }) => (
  <img
    src={`https://static.bitfinex.com/images/icons/${ccy}-alt.svg`}
    alt='coin'
    className={cx('hfui-ccy-icon', className, { small })}
  />
)

CCYIcon.defaultProps = {
  small: false,
  className: null,
}

CCYIcon.propTypes = {
  ccy: PropTypes.string.isRequired,
  small: PropTypes.bool,
  className: PropTypes.string,
}

export default memo(CCYIcon)
