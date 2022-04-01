import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import _toUpper from 'lodash/toUpper'

import OrderFormModal from '../../OrderFormModal'

const UnconfiguredModal = ({ onClick, isPaperTrading, keyExistButNotValid }) => {
  const { t } = useTranslation()
  return (
    <OrderFormModal
      title={_toUpper(keyExistButNotValid ? t('appSettings.apiNotValid') : t('appSettings.apiNotConfigured'))}
      icon='icon-api'
      onClick={onClick}
      content={(
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a className='submit-keys'>
          {keyExistButNotValid ? t('ui.updateBtn') : t('ui.submitBtn')}
          &nbsp;
          {isPaperTrading && `${t('main.sandbox')} ${t('main.mode')}`}
          &nbsp;
          {t('appSettings.apiKeys')}
        </a>
      )}
    />
  )
}

UnconfiguredModal.propTypes = {
  onClick: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  keyExistButNotValid: PropTypes.bool,
}

UnconfiguredModal.defaultProps = {
  keyExistButNotValid: false,
}

export default memo(UnconfiguredModal)
