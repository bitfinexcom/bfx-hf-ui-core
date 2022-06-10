import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import { MAX_STRATEGY_LABEL_LENGTH as MAX_LABEL_LENGTH } from '../../constants/variables'

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
