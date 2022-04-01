import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import _toUpper from 'lodash/toUpper'

import Input from '../../../../ui/Input'
import Button from '../../../../ui/Button'
import OrderFormModal from '../../OrderFormModal'

const SubmitAPIKeysModal = ({
  onClose,
  onSubmit,
  apiClientConnecting,
  isPaperTrading,
  isModal,
}) => {
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [error, setError] = useState('')

  const { t } = useTranslation()

  const submitHandler = () => {
    if (_isEmpty(apiKey)) {
      setError(t('orderForm.apiKeyRequired'))
    } else if (_isEmpty(apiSecret)) {
      setError(t('orderForm.apiSecretRequired'))
    } else {
      onSubmit({ apiKey, apiSecret })
      onClose()
    }
  }

  return (
    <OrderFormModal
      title={_toUpper(t('orderForm.submitKeys', { mode: isPaperTrading ? `${t('main.sandbox')} ${t('main.mode')}` : '' }))}
      icon='icon-api'
      isModal={isModal}
      apiClientConnecting={apiClientConnecting}
      form={[
        <div key='form' className='row'>
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
          <Button onClick={submitHandler} label={t('ui.submitBtn')} green />
          <Button onClick={onClose} label={t('ui.cancel')} red />
        </div>
      )}
    />
  )
}

SubmitAPIKeysModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  apiClientConnecting: PropTypes.bool,
  isModal: PropTypes.bool,
}

SubmitAPIKeysModal.defaultProps = {
  isModal: true,
  apiClientConnecting: false,
}

export default memo(SubmitAPIKeysModal)
