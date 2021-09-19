import React, { memo } from 'react'
import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import { Checkbox, Tooltip } from '@ufx-ui/core'
import _toUpper from 'lodash/toUpper'

import { renderString } from './fields.helpers'

const CheckboxInput = memo(({
  id, value, def: { label, customHelp } = {}, onChange, disabled, renderData,
}) => (
  <Tooltip content={customHelp} className='__react-tooltip __react_component_tooltip'>
    <div className={ClassNames('hfui-orderform__input inline', { disabled })}>
      <Checkbox
        id={id}
        checked={!!value}
        onChange={onChange}
        disabled={disabled}
        label={_toUpper(renderString(label, renderData))}
        className='hfui-help-checkbox'
      />
    </div>
  </Tooltip>
))

CheckboxInput.DEFAULT_VALUE = false

CheckboxInput.displayName = 'CheckboxInput'

CheckboxInput.propTypes = {
  id: PropTypes.string.isRequired,
  def: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string, PropTypes.bool,
  ])).isRequired,
  renderData: PropTypes.shape({
    QUOTE: PropTypes.string.isRequired,
    BASE: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

CheckboxInput.defaultProps = {
  disabled: false,
}

export default CheckboxInput
