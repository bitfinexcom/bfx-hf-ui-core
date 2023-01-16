import React from 'react'
import _reduce from 'lodash/reduce'
import { Icon } from 'react-fa'

export const dropdownOptionsAdaptor = (options) => {
  return _reduce(options, (nextOptions, option) => ({
    ...nextOptions,
    [option.label]: option.label,
  }), {})
}

export const getTabs = (t, savedStrategiesExists, isStrategySelected) => {
  return [
    {
      label: t('strategyEditor.currentStrategyTab'),
      value: 'current',
      disabled: !isStrategySelected,
    },
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
