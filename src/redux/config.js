const REDUCER_PATHS = {
  WS: 'ws',
  ROUTER: 'router',
  META: 'meta',
  UI: 'ui',
  NOTIFICATIONS: 'notifications',
  AOS: 'aos',
  ZENDESK: 'zendesk',
}

const UFX_REDUCER_PATHS = {
  UFX: 'ufx',
  WS: 'ws',
  BOOK: 'book',
  TRADES: 'trades',
  TICKER: 'ticker',
}

const MAX_STORED_TRADES = 25

const isElectronApp = process.env.REACT_APP_IS_ELECTRON_APP === 'true'

const PUB_WS_API_URL = process.env.REACT_APP_WS_API_URL || 'wss://api-pub.bitfinex.com/ws/2'

const PUB_REST_API_URL = isElectronApp ? '//localhost:45001' : process.env.REACT_APP_REST_PUBLIC_API_URL

const electronAppVersion = process.env.REACT_APP_BFX_HF_UI_VERSION

export {
  REDUCER_PATHS,
  PUB_WS_API_URL,
  PUB_REST_API_URL,
  UFX_REDUCER_PATHS,
  MAX_STORED_TRADES,
  isElectronApp,
  electronAppVersion,
}
