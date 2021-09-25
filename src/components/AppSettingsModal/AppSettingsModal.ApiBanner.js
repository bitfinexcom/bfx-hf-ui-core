import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { ReactComponent as CheckIcon } from './check.svg'
import { ReactComponent as ErrorIcon } from './error.svg'
import { ReactComponent as ClockIcon } from './clock.svg'

const ApiBanner = ({
  isUpdating,
  apiKeyState,
}) => {
  const { configured, valid } = apiKeyState
  const { t } = useTranslation()

  if (isUpdating) {
    return (
      <div className='appsettings-modal__api-configuration-message is-warning'>
        <ClockIcon />
        {' '}
        {t('appSettings.validating')}
      </div>
    )
  }
  if (!configured) {
    return (
      <div className='appsettings-modal__api-configuration-message is-error'>
        <ErrorIcon />
        {' '}
        {t('appSettings.apiNotConfigured')}
      </div>
    )
  }
  if (!valid) {
    return (
      <div className='appsettings-modal__api-configuration-message is-error'>
        <ErrorIcon />
        {' '}
        {t('appSettings.apiNotValid')}
      </div>
    )
  }
  return (
    <div className='appsettings-modal__api-configuration-message is-success'>
      <CheckIcon />
      {' '}
      {t('appSettings.configured')}
    </div>
  )
}

ApiBanner.propTypes = {
  isUpdating: PropTypes.bool.isRequired,
  apiKeyState: PropTypes.shape({
    configured: PropTypes.bool,
    valid: PropTypes.bool,
  }),
}

ApiBanner.defaultProps = {
  apiKeyState: {
    configured: false,
    valid: false,
  },
}

export default memo(ApiBanner)
