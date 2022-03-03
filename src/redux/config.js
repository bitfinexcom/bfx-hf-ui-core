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

const isElectronApp = process.env.REACT_APP_IS_ELECTRON_APP === 'true'

const showInDevelopmentModules = process.env.REACT_APP_SHOW_IN_DEVLOPMENT_MODULES === 'true'

const env = isElectronApp ? 'electron' : process.env.REACT_APP_ENVIRONMENT

const PUB_REST_API_URL = isElectronApp ? 'http://localhost:45001' : process.env.REACT_APP_UFX_PUBLIC_API_URL

const appVersion = process.env.npm_package_version

const CHART_URL = isElectronApp ? 'https://bitfinexcom.github.io/bfx-hf-tradingview' : process.env.REACT_APP_CHART_URL

const HONEY_AUTH_URL = `${process.env.REACT_APP_UFX_API_URL}/honey`

export {
  REDUCER_PATHS,
  PUB_REST_API_URL,
  UFX_REDUCER_PATHS,
  isElectronApp,
  appVersion,
  env,
  CHART_URL,
  HONEY_AUTH_URL,
  showInDevelopmentModules,
}
