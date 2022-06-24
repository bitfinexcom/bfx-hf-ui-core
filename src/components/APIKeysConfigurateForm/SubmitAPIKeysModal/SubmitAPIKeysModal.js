import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import _toUpper from 'lodash/toUpper'

import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import APIKeysConfigurateForm from '../APIKeysConfigurateForm'

const SubmitAPIKeysModal = ({
  onSubmit, apiClientConnecting, isPaperTrading, isModal, keyExistButNotValid,
}) => {
  const { t } = useTranslation()
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [error, setError] = useState('')

  const isResetDisabled = _isEmpty(apiKey) && _isEmpty(apiSecret)

  const reset = () => {
    setApiKey('')
    setApiSecret('')
    setError('')
  }

  const submitHandler = () => {
    if (_isEmpty(apiKey)) {
      setError(t('orderForm.apiKeyRequired'))
    } else if (_isEmpty(apiSecret)) {
      setError(t('orderForm.apiSecretRequired'))
    } else {
      onSubmit({ apiKey, apiSecret })
      setError('')
    }
  }

  return (
    <APIKeysConfigurateForm
      title={_toUpper(
        t('orderForm.submitKeys', {
          mode: isPaperTrading ? t('main.sandbox') : '',
        }),
      )}
      content={keyExistButNotValid && t('appSettings.apiNotValid')}
      icon='icon-api'
      isModal={isModal}
      apiClientConnecting={apiClientConnecting}
      form={[
        <div key='form' className='inputs'>
          <Input
            type='text'
            placeholder={_toUpper(t('appSettings.apiKey'))}
            value={apiKey}
            onChange={setApiKey}
          />
          <Input
            type='password'
            placeholder={_toUpper(t('appSettings.apiSecret'))}
            value={apiSecret}
            onChange={setApiSecret}
          />
        </div>,
        error && (
          <div key='error' className='row'>
            <p className='error'>{error}</p>
          </div>
        ),
      ]}
      buttons={(
        <div className='row'>
          <Button onClick={reset} label={t('ui.cancel')} disabled={isResetDisabled} red />
          <Button onClick={submitHandler} label={t('ui.submitBtn')} green />
        </div>
      )}
      showDescription
    />
  )
}

SubmitAPIKeysModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  keyExistButNotValid: PropTypes.bool.isRequired,
  apiClientConnecting: PropTypes.bool,
  isModal: PropTypes.bool,
}

SubmitAPIKeysModal.defaultProps = {
  isModal: true,
  apiClientConnecting: false,
}

export default memo(SubmitAPIKeysModal)
