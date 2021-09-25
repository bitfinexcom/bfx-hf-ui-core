import React, { useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'

import { useTranslation } from 'react-i18next'
import Button from '../../ui/Button'
import Input from '../../ui/Input'

const AuthenticationInitForm = ({ onInit }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onSubmit = () => {
    onInit(password)
  }
  const submitReady = (
    (!_isEmpty(password) && !_isEmpty(confirmPassword))
    && (password === confirmPassword)
  )

  const { t } = useTranslation()

  return (
    <div className='hfui-authenticationpage__content'>
      <h2>Honey Framework UI</h2>
      <p>{t('auth.initMsg')}</p>

      <form className='hfui-authenticationpage__inner-form'>
        <Input
          type='text'
          name='username'
          placeholder='Username'
          autocomplete='username'
          style={{ display: 'none' }}
        />

        <Input
          type='password'
          autocomplete='new-password'
          placeholder={t('auth.password')}
          value={password}
          onChange={setPassword}
        />

        <Input
          type='password'
          autocomplete='new-password'
          placeholder={t('auth.confirmPsw')}
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <Button
          onClick={onSubmit}
          disabled={!submitReady}
          label={t('auth.saveCredentsBtn')}
          green
        />

      </form>
    </div>
  )
}

AuthenticationInitForm.propTypes = {
  onInit: PropTypes.func.isRequired,
}

export default AuthenticationInitForm
