import React, { memo } from 'react'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import _map from 'lodash/map'

import RadioButton from '../../../ui/RadioButton'
import { renderString } from './fields.helpers'

const RadioInput = memo(
  ({
    def: { options }, renderData, value, onChange, disabled,
  }) => (
    <div className={ClassNames('hfui-orderform__input', { disabled })}>
      {_map(options, ({ value: v, label }, i) => (
        <RadioButton
          key={i}
          label={renderString(label, renderData)}
          value={value === v}
          onChange={() => onChange(v)}
          uppercase
        />
      ))}
    </div>
  ),
)

RadioInput.displayName = 'RadioInput'

RadioInput.propTypes = {
  def: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.array,
      PropTypes.object,
    ]),
  ).isRequired,
  renderData: PropTypes.shape({
    QUOTE: PropTypes.string.isRequired,
    BASE: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

RadioInput.defaultProps = {
  disabled: false,
}

export default RadioInput
