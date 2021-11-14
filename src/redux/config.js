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
  CURRENCIES: 'currencies',
}

const MAX_STORED_TRADES = 25

const isElectronApp = process.env.REACT_APP_IS_ELECTRON_APP === 'true'

const PUB_REST_API_URL = isElectronApp ? 'http://localhost:45001' : process.env.REACT_APP_UFX_PUBLIC_API_URL

const PUB_WSS_API_URL = process.env.REACT_APP_UFX_WSS_URL

const appVersion = process.env.npm_package_version

const CHART_URL = isElectronApp ? 'https://bitfinexcom.github.io/bfx-hf-tradingview' : process.env.REACT_APP_CHART_URL

export {
  REDUCER_PATHS,
  PUB_REST_API_URL,
  UFX_REDUCER_PATHS,
  MAX_STORED_TRADES,
  isElectronApp,
  appVersion,
  PUB_WSS_API_URL,
  CHART_URL,
}
