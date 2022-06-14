import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'

import { validatePassword } from '../../util/password'
import { isDevEnv } from '../../redux/config'
import Button from '../../ui/Button'
import Input from '../../ui/Input'

const hiddenInputStyle = {
  display: 'none',
}

const AuthenticationInitForm = ({ onInit }) => {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState(null)
  const [wasSubmitted, setWasSubmitted] = useState(false)

  useEffect(() => {
    if (!isDevEnv && wasSubmitted) {
      const result = validatePassword(password, t)
      setPasswordError(result)
    }
  }, [wasSubmitted, password, t])

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

    if (!isDevEnv && !_isEmpty(validatePassword(password, t))) {
      setWasSubmitted(true)
      return
    }

    registerCredentials()
  }

  return (
    <div className='hfui-authenticationpage__content'>
      <h2>HoneyFramework UI</h2>
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

        <div className='hfui-authenticationpage__inner-form_error'>
          {passwordError}
        </div>

        <Button
          onClick={onSubmit}
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
