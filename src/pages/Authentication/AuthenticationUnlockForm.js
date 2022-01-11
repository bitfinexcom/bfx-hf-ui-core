import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'

import Input from '../../ui/Input'
import Button from '../../ui/Button'
import Dropdown from '../../ui/Dropdown'
import {
  getStoredPassword,
  getAutoLoginState,
  isDevEnv as devEnv,
  updateAutoLoginState,
  updateStoredPassword,
} from '../../util/autologin'
import { MAIN_MODE, PAPER_MODE } from '../../redux/reducers/ui'

const isDevEnv = devEnv()

const initialAutoLoginSave = getAutoLoginState()

const getModes = (t) => {
  const MAIN_MODE_OPTION = { value: MAIN_MODE, label: t('main.production') }
  const PAPER_MODE_OPTION = { value: PAPER_MODE, label: t('main.paper') }
  return [MAIN_MODE_OPTION, PAPER_MODE_OPTION]
}

const AuthenticationUnlockForm = ({ isPaperTrading, onUnlock: _onUnlock, onReset }) => {
  const [password, setPassword] = useState('')
  const [autoLoginState, setAutoLoginState] = useState(initialAutoLoginSave)
  const [mode, setMode] = useState(isPaperTrading ? PAPER_MODE : MAIN_MODE)
  const submitReady = !_isEmpty(password) && !_isEmpty(mode)

  const { t } = useTranslation()

  const OPTIONS = getModes(t)

  const onUnlock = useCallback(() => {
    if (!submitReady) return

    if (isDevEnv && password.length) {
      updateStoredPassword(password)
      updateAutoLoginState(autoLoginState)
    }

    _onUnlock(password, mode)
  }, [_onUnlock, autoLoginState, mode, password, submitReady])

  const onFormSubmit = (event) => {
    event.preventDefault()
    onUnlock()
  }

  useEffect(() => {
    const pass = getStoredPassword()
    if (isDevEnv && pass && autoLoginState) {
      setPassword(pass)
    }
  }, [autoLoginState])

  useEffect(() => {
    if (password && isDevEnv && initialAutoLoginSave) {
      onUnlock()
    }
  }, [onUnlock, password])

  return (
    <div className='hfui-authenticationpage__content'>
      <h2>Honey Framework UI</h2>

      <form className='hfui-authenticationpage__inner-form' onSubmit={onFormSubmit}>
        <p>{t('auth.enterPsw')}</p>
        <Input
          type='password'
          autocomplete='current-password'
          placeholder={t('auth.password')}
          value={password}
          onChange={setPassword}
          shouldBeAutofocused
        />
        <div className='hfui-authenticationpage__mode-select'>
          <p>{t('auth.selectMode')}</p>

          <Dropdown
            className='hfui-authenticationpage__trading-mode'
            placeholder={t('auth.selectMode')}
            // eslint-disable-next-line lodash/prefer-lodash-method
            value={OPTIONS.find(o => o.value === mode)?.value}
            options={OPTIONS}
            onChange={(value) => setMode(value)}
          />
        </div>
        {isDevEnv && (
          <div className='hfui-authenticationpage__dev-mode'>
            <Checkbox
              label={t('appSettings.autologin')}
              checked={autoLoginState}
              onChange={setAutoLoginState}
            />
          </div>
        )}
        <Button
          onClick={onUnlock}
          disabled={!submitReady}
          label={t('auth.unlockBtn')}
          isSubmit
          green
        />
      </form>

      <div className='hfui-authenticationpage__clear'>
        <p>{t('auth.resetMsg')}</p>

        <Button
          onClick={onReset}
          label={t('auth.resetBtn')}
          red
        />
      </div>
    </div>
  )
}

AuthenticationUnlockForm.propTypes = {
  onUnlock: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
}

export default AuthenticationUnlockForm
