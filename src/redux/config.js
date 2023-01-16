import { version } from '../../package.json'

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

const isElectronApp = import.meta.env.VITE_IS_ELECTRON_APP === 'true'

const isDevEnv = import.meta.env.VITE_DEV === 'true'

const env = isElectronApp ? 'electron' : import.meta.env.VITE_ENVIRONMENT

const isMacOS = navigator.userAgent.indexOf('Mac') !== -1

const PUB_REST_API_URL = isElectronApp ? 'http://localhost:45001' : import.meta.env.VITE_UFX_PUBLIC_API_URL

const appVersion = version

const RELEASE_URL = 'https://github.com/bitfinexcom/bfx-hf-ui/releases'

const API_DOCS_URL = 'https://docs.bitfinex.com/docs/introduction'

const SOURCE_CODE_URL = 'https://github.com/bitfinexcom/bfx-hf-ui'

const LICENCE_URL = 'https://github.com/bitfinexcom/bfx-hf-ui/blob/master/LICENSE'

const MARGIN_TRADING_ARTICLE_URL = 'https://support.bitfinex.com/hc/en-us/articles/115004555165-What-is-Margin-Trading-on-Bitfinex'

const STOP_ORDER_ARTICLE_URL = 'https://support.bitfinex.com/hc/en-us/articles/115003506125-What-is-a-Stop-Order-on-Bitfinex'

// product description link
const HF_DESC_URL = 'https://support.bitfinex.com/hc/en-us/articles/900000096823-Honey-Framework'

const CHART_URL = isElectronApp ? 'https://bitfinexcom.github.io/bfx-hf-tradingview/' : import.meta.env.VITE_CHART_URL

const HONEY_AUTH_URL = `${import.meta.env.VITE_UFX_API_URL}/honey`

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 64

export {
  REDUCER_PATHS,
  PUB_REST_API_URL,
  UFX_REDUCER_PATHS,
  isElectronApp,
  appVersion,
  env,
  isMacOS,
  CHART_URL,
  HONEY_AUTH_URL,
  RELEASE_URL,
  API_DOCS_URL,
  SOURCE_CODE_URL,
  LICENCE_URL,
  HF_DESC_URL,
  isDevEnv,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  MARGIN_TRADING_ARTICLE_URL,
  STOP_ORDER_ARTICLE_URL,
}
