import { isElectronApp } from '../redux/config'

export const getScope = () => {
  return isElectronApp ? 'app' : 'web'
}
