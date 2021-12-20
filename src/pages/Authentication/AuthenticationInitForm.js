import React, { useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'

import { useTranslation } from 'react-i18next'
import Button from '../../ui/Button'
import Input from '../../ui/Input'

const hiddenInputStyle = {
  display: 'none',
}

const AuthenticationInitForm = ({ onInit }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const submitReady = (
    (!_isEmpty(password) && !_isEmpty(confirmPassword))
    && (password === confirmPassword)
  )

  const registerCredentials = () => {
    if (!password || !confirmPassword || !submitReady) {
      return
    }
    onInit(password)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    registerCredentials()
  }

  const { t } = useTranslation()

  return (
    <div className='hfui-authenticationpage__content'>
      <h2>Honey Framework UI</h2>
      <p>{t('auth.initMsg')}</p>

      <form className='hfui-authenticationpage__inner-form' onSubmit={onSubmit}>
        <Input
          type='text'
          name='username'
          placeholder='Username'
          autocomplete='username'
          style={hiddenInputStyle}
        />

        <Input
          type='password'
          autocomplete='new-password'
          placeholder={t('auth.password')}
          value={password}
          onChange={setPassword}
          shouldBeAutofocused
        />

        <Input
          type='password'
          autocomplete='new-password'
          placeholder={t('auth.confirmPsw')}
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <Button
          onClick={registerCredentials}
          disabled={!submitReady}
          label={t('auth.saveCredentsBtn')}
          isSubmit
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
