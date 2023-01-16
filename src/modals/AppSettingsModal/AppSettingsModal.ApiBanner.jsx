import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import CheckIcon from './check.svg'
import ErrorIcon from './error.svg'
import ClockIcon from './clock.svg'
import AttentionBar from '../../ui/AttentionBar/AttentionBar'

const ApiBanner = ({ isUpdating, apiKeyState }) => {
  const { configured, valid } = apiKeyState
  const { t } = useTranslation()

  if (isUpdating) {
    return (
      <AttentionBar
        yellow
        className='appsettings-modal__api-configuration-message'
      >
        <ClockIcon />
        {t('appSettings.validating')}
      </AttentionBar>
    )
  }
  if (!configured) {
    return (
      <AttentionBar
        red
        className='appsettings-modal__api-configuration-message'
      >
        <ErrorIcon />
        {t('appSettings.apiNotConfigured')}
      </AttentionBar>
    )
  }
  if (!valid) {
    return (
      <AttentionBar
        red
        className='appsettings-modal__api-configuration-message'
      >
        <ErrorIcon />
        {t('appSettings.apiNotValid')}
      </AttentionBar>
    )
  }
  return (
    <AttentionBar
      green
      className='appsettings-modal__api-configuration-message'
    >
      <CheckIcon />
      {t('appSettings.configured')}
    </AttentionBar>
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
