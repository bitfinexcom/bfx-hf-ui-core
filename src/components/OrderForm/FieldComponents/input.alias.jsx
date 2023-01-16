import React from 'react'
import cx from 'clsx'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import Input from '../../../ui/Input'
import {
  ALIAS_MAX_CHARS,
  CONVERT_LABELS_TO_PLACEHOLDERS,
} from './fields.helpers'

const AliasInput = ({
  def: { label },
  disabled,
  validationError,
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={cx('hfui-orderform__input', {
        disabled,
        invalid: !!validationError,
      })}
    >
      <Input
        {...props}
        placeholder={t('algoOrderForm.aliasPlaceholder')}
        type='text'
      />
      {!CONVERT_LABELS_TO_PLACEHOLDERS && (
        <p className='hfui-orderform__input-label'>{label}</p>
      )}

      {validationError && (
        <p className='hfui-orderform__input-error-label'>{validationError}</p>
      )}
    </div>
  )
}

AliasInput.validateValue = (v, t) => {
  if (v.length > ALIAS_MAX_CHARS) {
    return t('algoOrderForm.validationMessages.aliasMaxLength', {
      value: ALIAS_MAX_CHARS,
    })
  }

  return null
}

AliasInput.propTypes = {
  def: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.bool,
    ]),
  ),
  disabled: PropTypes.bool,
  validationError: PropTypes.string,
}

AliasInput.defaultProps = {
  def: {},
  disabled: false,
  validationError: '',
}

export default AliasInput
