import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { ReactComponent as CheckIcon } from './check.svg'
import { ReactComponent as ErrorIcon } from './error.svg'
import { ReactComponent as ClockIcon } from './clock.svg'
import { isWrongAPIKeys } from '../../redux/selectors/ws'

const ApiBanner = ({
  apiClientConfigured,
  apiClientConnected,
  isValidKey,
  isCurrentMode,
}) => {
  const wrongAPIKeys = useSelector(isWrongAPIKeys)
  if (isCurrentMode) {
    return (
      <>
        {wrongAPIKeys ? (
          <div className='appsettings-modal__api-configuration-message is-error'>
            <ErrorIcon />
            {' '}
            Invalid API Keys entered
          </div>
        ) : !isValidKey ? (
          <div className='appsettings-modal__api-configuration-message is-error'>
            <ErrorIcon />
            {' '}
            Not Configured
          </div>
        ) : apiClientConfigured && apiClientConnected ? (
          <div className='appsettings-modal__api-configuration-message is-success'>
            <CheckIcon />
            {' '}
            Configured
          </div>
        ) : (
          <div className='appsettings-modal__api-configuration-message is-warning'>
            <ClockIcon />
            {' '}
            Validating...
          </div>
        )}
      </>
    )
  }
  return (
    <>
      {isValidKey ? (
        <div className='appsettings-modal__api-configuration-message is-success'>
          <CheckIcon />
          {' '}
          Configured
        </div>
      ) : (
        <div className='appsettings-modal__api-configuration-message is-error'>
          <ErrorIcon />
          {' '}
          Not Configured or entered invalid key
        </div>
      )}
    </>
  )
}

ApiBanner.propTypes = {
  apiClientConfigured: PropTypes.bool.isRequired,
  apiClientConnected: PropTypes.bool.isRequired,
  isValidKey: PropTypes.bool.isRequired,
  isCurrentMode: PropTypes.bool.isRequired,
}

export default memo(ApiBanner)
