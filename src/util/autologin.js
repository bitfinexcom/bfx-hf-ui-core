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
  if (isDevEnv()) {
    localStorage.setItem(PASS, password)
  } else {
    window.electronService.saveKeyToEStore(PASS, password)
  }
}

export function removeStoredPassword() {
  if (isDevEnv()) {
    localStorage.removeItem(PASS)
  } else {
    window.electronService.deleteKeyFromEStore(PASS)
  }
}

export function getStoredPassword() {
  if (isDevEnv()) {
    return localStorage.getItem(PASS)
  }
  const final = window.electronService.getKeyFromEStore(PASS)
  // const checkInstance = window.electronService.checkInstance()
  // console.log('checkInstance: ', checkInstance)
  console.log('final: ', final)
  const ans = window.electronService.sendCheckSafeStorageAvl()
  console.log('ans: 222: ', ans)
  return final
}
