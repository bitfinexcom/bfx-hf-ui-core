import { isElectronApp } from '../redux/config'

export const MAX_STRATEGY_LABEL_LENGTH = 150
export const MIN_SAFE_WIDTH = isElectronApp ? 1200 : 100
