import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import OrderFormModal from '../../OrderFormModal'

const UnconfiguredModal = ({ onClick, isPaperTrading, keyExistButNotValid }) => {
  const { t } = useTranslation()
  return (
    <OrderFormModal
      title={(keyExistButNotValid ? t('appSettings.apiNotValid') : t('appSettings.apiNotConfigured')).toUpperCase()}
      icon='icon-api'
      onClick={onClick}
      content={(
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a className='submit-keys'>
          {keyExistButNotValid ? t('ui.updateBtn') : t('ui.submitBtn')}
          &nbsp;
          {isPaperTrading && t('main.paper')}
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
  keyExistButNotValid: PropTypes.bool.isRequired,
}

export default memo(UnconfiguredModal)
