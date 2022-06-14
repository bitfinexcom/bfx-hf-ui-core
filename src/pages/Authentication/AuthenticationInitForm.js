import React, { useState, useEffect } from 'react'
import { Tooltip } from '@ufx-ui/core'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'

import { validatePassword } from '../../util/password'
import {
  isDevEnv, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH,
} from '../../redux/config'
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
  const [requirements, setRequirements] = useState(null)

  useEffect(() => {
    if (!isDevEnv && wasSubmitted) {
      const result = validatePassword(password, t)
      setPasswordError(result)
    }
  }, [wasSubmitted, password, t])

  useEffect(() => {
    const requirementsStr = `- ${t('auth.passwordValidation.atLeastXChars', { amount: PASSWORD_MIN_LENGTH })}
      - ${t('auth.passwordValidation.lessThanX', { amount: PASSWORD_MAX_LENGTH })}
      - ${t('auth.passwordValidation.uppercase')}
      - ${t('auth.passwordValidation.lowercase')}
      - ${t('auth.passwordValidation.specialChars')}
      - ${t('auth.passwordValidation.numbers')}
    `
    setRequirements(requirementsStr)
  }, [t])

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
      <h2>Bitfinex Honey UI</h2>
      <p>
        {t('auth.initMsg')}
      </p>

      {!isDevEnv && (
        <p className='hfui-authenticationpage__content_password_req'>
          {t('auth.strongPassword')}
          <Tooltip className='hfui-authenticationpage__content_password_req_tooltip' content={requirements}>
            <i className='fa fa-info-circle' />
          </Tooltip>
        </p>
      )}

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
