import { Recurring } from 'bfx-hf-algo'
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

const isElectronApp = process.env.REACT_APP_IS_ELECTRON_APP === 'true'

const isDevEnv = process.env.REACT_APP_DEV === 'true'

const env = isElectronApp ? 'electron' : process.env.REACT_APP_ENVIRONMENT

const isMacOS = navigator.userAgent.indexOf('Mac') !== -1

const PUB_REST_API_URL = isElectronApp ? 'http://localhost:45001' : process.env.REACT_APP_UFX_PUBLIC_API_URL

const appVersion = version

const RELEASE_URL = 'https://github.com/bitfinexcom/bfx-hf-ui/releases'

const API_DOCS_URL = 'https://docs.bitfinex.com/docs/introduction'

const SOURCE_CODE_URL = 'https://github.com/bitfinexcom/bfx-hf-ui'

const ISSUES_REPORT_URL = 'https://bitfinex-honey.upvoty.com/b/issues/'

const LICENCE_URL = 'https://github.com/bitfinexcom/bfx-hf-ui/blob/master/LICENSE'

const MARGIN_TRADING_ARTICLE_URL = 'https://support.bitfinex.com/hc/en-us/articles/115004555165-What-is-Margin-Trading-on-Bitfinex'

const STOP_ORDER_ARTICLE_URL = 'https://support.bitfinex.com/hc/en-us/articles/115003506125-What-is-a-Stop-Order-on-Bitfinex'

const SETUP_TIMESTAMP_FORMAT_ARTICLE = 'https://bitfinex-honey.readme.io/docs/timestamp-format?utm-source=standalone'

const DISCONTINUE_DMS_SUPPORT_ARTICLE_DMS = 'https://www.bitfinex.com/posts/1072/'

// product description link
const HF_DESC_URL = 'https://support.bitfinex.com/hc/en-us/articles/900000096823-Honey-Framework'

const DISCUSSION_BOARD_URL = 'https://bit.ly/42p9YiV'
const DISCORD_URL = 'https://bit.ly/400Xj49'

const CHART_URL = isElectronApp ? 'https://bitfinexcom.github.io/bfx-hf-tradingview/' : process.env.REACT_APP_CHART_URL

const HONEY_AUTH_URL = `${process.env.REACT_APP_UFX_API_URL}/honey`

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 64

const HOSTED_ALGO_ORDERS = [Recurring.id]

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
  HOSTED_ALGO_ORDERS,
  ISSUES_REPORT_URL,
  SETUP_TIMESTAMP_FORMAT_ARTICLE,
  DISCUSSION_BOARD_URL,
  DISCORD_URL,
  DISCONTINUE_DMS_SUPPORT_ARTICLE_DMS,
}
