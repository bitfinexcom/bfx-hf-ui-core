import { isElectronApp } from '../redux/config'

export const MAX_STRATEGY_LABEL_LENGTH = 150
export const DONT_SHOW_DMS_MODAL_KEY = 'HF_UI_DONT_SHOW_DMS_MODAL'
export const MIN_SAFE_WIDTH = isElectronApp ? 1200 : 100
