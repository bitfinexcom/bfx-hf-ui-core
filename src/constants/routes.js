import { isElectronApp } from '../redux/config'

export const tradingTerminal = {
  path: '/',
  label: 'Trading Terminal',
}

export const marketData = {
  path: '/data',
  label: 'Market Data',
}

export const strategyEditor = {
  path: '/strategy-editor',
  label: 'Strategy Editor',
}

const routes = {
  tradingTerminal,
  marketData,
  ...(isElectronApp ? { strategyEditor } : {}),
}

export default routes
