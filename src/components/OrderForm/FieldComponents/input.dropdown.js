import React, { memo } from 'react'
import ClassNames from 'clsx'
import { Tooltip } from '@ufx-ui/core'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _keys from 'lodash/keys'

import Dropdown from '../../../ui/Dropdown'
import { renderString, CONVERT_LABELS_TO_PLACEHOLDERS } from './fields.helpers'

const DropdownInput = ({
  value, disabled, onChange, def: { label, options, customHelp }, validationError, renderData,
}) => {
  const renderedLabel = renderString(label, renderData)

  return (
    <div className={ClassNames('hfui-orderform__input', {
      disabled,
      invalid: !!validationError,
    })}
    >
      <Dropdown
        value={value}
        onChange={onChange}
        placeholder={CONVERT_LABELS_TO_PLACEHOLDERS ? renderedLabel : undefined}
        options={_map(_keys(options), opt => ({
          label: options[opt],
          value: opt,
        }))}
      />

      {!CONVERT_LABELS_TO_PLACEHOLDERS && (
        <p className='hfui-orderform__input-label'>
          {renderedLabel}
          {customHelp && (
            <Tooltip className='__react-tooltip __react_component_tooltip' content={customHelp}>
              <i className='fa fa-info-circle' />
            </Tooltip>
          )}
        </p>
      )}

      {validationError && (
        <p className='hfui-orderform__input-error-label'>
          {validationError}
        </p>
      )}
    </div>
  )
}

DropdownInput.propTypes = {
  def: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string, PropTypes.bool, PropTypes.object,
  ])).isRequired,
  renderData: PropTypes.shape({
    QUOTE: PropTypes.string.isRequired,
    BASE: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validationError: PropTypes.string,
  disabled: PropTypes.bool,
}

DropdownInput.defaultProps = {
  disabled: false,
  value: '',
  validationError: '',
}

export default memo(DropdownInput)
