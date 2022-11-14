import { isElectronApp } from '../redux/config'

export const MAX_STRATEGY_LABEL_LENGTH = 150
export const DONT_SHOW_DMS_MODAL_KEY = 'HF_UI_DONT_SHOW_DMS_MODAL'
export const MIN_SAFE_WIDTH = isElectronApp ? 1200 : 100

// A random visitor ID which is generated on login and is used for Pendo tracking
export const LOCAL_STORAGE_UID = 'HF_VISITOR_ID'
