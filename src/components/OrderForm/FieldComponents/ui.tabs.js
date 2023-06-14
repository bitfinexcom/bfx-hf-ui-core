import React, { memo } from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'clsx'
import _map from 'lodash/map'
import OrderFormTab from './ui.tab'

const OrderFormTabs = ({
  def, onChange, className, value,
}) => {
  const { options } = def

  return (
    <div className={ClassNames('hfui-orderform__input', className)}>
      {_map(options, ({ value: v, label }, i) => (
        <OrderFormTab
          key={i} //eslint-disable-line
          label={label}
          value={v}
          isActive={value === v}
          onClick={onChange}
        />
      ))}
    </div>
  )
}

OrderFormTabs.propTypes = {
  def: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string, PropTypes.bool, PropTypes.array,
  ])).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
}

OrderFormTabs.defaultProps = {
  className: null,
}

export default memo(OrderFormTabs)
