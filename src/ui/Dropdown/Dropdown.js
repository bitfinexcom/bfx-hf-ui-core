import React, { memo, useMemo, forwardRef } from 'react'
import PropTypes from 'prop-types'
import _reduce from 'lodash/reduce'

import { Dropdown as UfxDropdown } from '@ufx-ui/core'
import './style.css'

function optionsAdaptor(options) {
  return _reduce(options, (nextOptions, option) => ({
    ...nextOptions,
    [option.value]: option.label,
  }), {})
}

// eslint-disable-next-line prefer-arrow-callback
const Dropdown = forwardRef(function Dropdown(props, ref) {
  const {
    icon,
    label,
    value,
    isOpen,
    options,
    highlight,
    className,
    ...rest
  } = props

  const adaptedOptions = useMemo(() => optionsAdaptor(options), [options])

  return (
    <div className='hfui-dropdown__wrapper'>
      {label && (
        <p>{label}</p>
      )}

      <UfxDropdown
        ref={ref}
        value={value}
        className={className}
        closeOnMouseLeave={false}
        options={adaptedOptions}
        {...rest}
      />
    </div>
  )
})

Dropdown.propTypes = {
  isOpen: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  highlight: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.any, // eslint-disable-line
    value: PropTypes.any, // eslint-disable-line
  })).isRequired,
}
Dropdown.defaultProps = {
  value: '',
  icon: null,
  label: null,
  isOpen: false,
  className: '',
  disabled: false,
  highlight: false,
  placeholder: undefined,
}

export default memo(Dropdown)
