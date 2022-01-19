import React, { memo } from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'clsx'

import './style.css'

const Button = ({
  onClick,
  isSubmit,
  label,
  red,
  green,
  blue,
  gray,
  className,
  dataProduct,
  disabled,
  inactive,
}) => {
  return (
    <button
      type={isSubmit ? 'submit' : 'button'}
      onClick={disabled ? () => {} : onClick}
      data-product={dataProduct}
      className={ClassNames('hfui-button', className, {
        red,
        blue,
        gray,
        green,
        disabled,
        inactive,
      })}
    >
      {label}
    </button>
  )
}

Button.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onClick: PropTypes.func,
  red: PropTypes.bool,
  green: PropTypes.bool,
  blue: PropTypes.bool,
  gray: PropTypes.bool,
  className: PropTypes.string,
  dataProduct: PropTypes.string,
  disabled: PropTypes.bool,
  inactive: PropTypes.bool,
  isSubmit: PropTypes.bool,
}

Button.defaultProps = {
  label: '',
  className: '',
  dataProduct: '',
  onClick: () => {},
  red: false,
  blue: false,
  gray: false,
  green: false,
  disabled: false,
  inactive: false,
  isSubmit: false,
}

export default memo(Button)
