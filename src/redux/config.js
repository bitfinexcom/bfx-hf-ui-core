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

const PUB_REST_API_URL = isElectronApp ? 'http://localhost:45001' : process.env.REACT_APP_REST_PUBLIC_API_URL

const protomatch = /^(https?|ftp):\/\//

const PUB_REST_API_URL_CHART = PUB_REST_API_URL.replace(protomatch, '')

const appVersion = process.env.npm_package_version

export {
  REDUCER_PATHS,
  PUB_REST_API_URL,
  PUB_REST_API_URL_CHART,
  UFX_REDUCER_PATHS,
  MAX_STORED_TRADES,
  isElectronApp,
  appVersion,
}
