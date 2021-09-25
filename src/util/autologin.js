const AUTOLOGIN = 'AUTOLOGIN'
const PASS = 'HFUI__PASS'

export function getAutoLoginState() {
  return localStorage.getItem(AUTOLOGIN) === 'true'
}

export function updateAutoLoginState(state) {
  localStorage.setItem(AUTOLOGIN, state)
}

export function isDevEnv() {
  return process.env?.NODE_ENV === 'development'
}

export function updateStoredPassword(password) {
  localStorage.setItem(PASS, password)
}

export function removeStoredPassword() {
  localStorage.removeItem(PASS)
}

export function getStoredPassword() {
  return localStorage.getItem(PASS)
}
