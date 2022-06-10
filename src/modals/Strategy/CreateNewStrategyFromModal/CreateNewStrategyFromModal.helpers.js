import React from 'react'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import _reduce from 'lodash/reduce'
import { Icon } from 'react-fa'
import { MAX_STRATEGY_LABEL_LENGTH as MAX_LABEL_LENGTH } from '../../../constants/variables'

export const dropdownOptionsAdaptor = (options) => {
  return _reduce(options, (nextOptions, option) => ({
    ...nextOptions,
    [option.label]: option.label,
  }), {})
}

export const getTabs = (t, savedStrategiesExists) => {
  return [
    {
      label: t('strategyEditor.templatesTab'),
      value: 'templates',
      Icon: <Icon name='file' />,
      disabled: false,
    },
    {
      label: t('strategyEditor.savedStrategiesTab'),
      value: 'saved',
      Icon: <Icon name='file-code-o' />,
      disabled: !savedStrategiesExists,
    },
  ]
}

export const validateStrategyName = (label, t) => {
  const labelSize = _size(label)

  if (_isEmpty(label)) {
    return t('strategyEditor.newStrategyModalEmptyError')
  }

  if (labelSize > MAX_LABEL_LENGTH) {
    return t('strategyEditor.newStrategyModalLongError', {
      labelSize,
      MAX_LABEL_LENGTH,
    })
  }

  return ''
}
