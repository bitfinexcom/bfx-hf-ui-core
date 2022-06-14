/* eslint-disable no-useless-escape */
import _size from 'lodash/size'
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from '../redux/config'

export const validatePassword = (password, t) => {
  if (_size(password) < PASSWORD_MIN_LENGTH) {
    return t('auth.passwordValidation.atLeastXChars', { amount: PASSWORD_MIN_LENGTH })
  }

  if (_size(password) > PASSWORD_MAX_LENGTH) {
    return t('auth.passwordValidation.lessThanX', { amount: PASSWORD_MAX_LENGTH })
  }

  if (!/[A-Z]/.test(password)) {
    return t('auth.passwordValidation.uppercase')
  }

  if (!/[a-z]/.test(password)) {
    return t('auth.passwordValidation.lowercase')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return t('auth.passwordValidation.specialChars')
  }

  if (!/\d/.test(password)) {
    return t('auth.passwordValidation.numbers')
  }

  return null
}
