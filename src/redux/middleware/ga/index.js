import ua from 'universal-analytics'
import { v4 } from 'uuid'

import {
  GA_CANCEL_AO, GA_PAGEVIEW, GA_CANCEL_ATOMIC_ORDER, GA_CREATE_STRATEGY, GA_SUBMIT_ATOMIC_ORDER, GA_SUBMIT_AO, GA_UPDATE_SETTINGS,
} from '../../constants/ga'

import { isElectronApp } from '../../config'
import { getGACustomerId, storeGACustomerId } from '../../../util/ga'

const GA_ID_ELECTRON_APP = 'UA-163797164-1'
const GA_ID_HOSTED_WEB = 'UA-212993021-1'

const gaID = isElectronApp ? GA_ID_ELECTRON_APP : GA_ID_HOSTED_WEB

const gaCustomerId = getGACustomerId()

if (!gaCustomerId) {
  console.log('storeGACustomerId: ')
  storeGACustomerId(v4())
}

const ReactGA = ua(gaID, getGACustomerId())
ReactGA.set('aip', '1')

export default () => {
  return store => next => (action = {}) => {
    const { type, payload = {} } = action
    const state = store.getState()
    const { ui = {} } = state
    const { settings = {} } = ui
    const ga = isElectronApp ? settings?.ga : true

    switch (type) {
      case GA_SUBMIT_ATOMIC_ORDER: {
        if (ga) {
          ReactGA.event('atomicOrder', 'atomicOrder.submit').send()
        }
        break
      }
      case GA_UPDATE_SETTINGS: {
        if (ga) {
          ReactGA.event('settings', 'settings.update').send()
        }
        break
      }
      case GA_SUBMIT_AO: {
        if (ga) {
          ReactGA.event('ao', 'ao.submit').send()
        }
        break
      }
      case GA_CREATE_STRATEGY: {
        if (ga) {
          ReactGA.event('strategy', 'strategy.create').send()
        }
        break
      }
      case GA_CANCEL_ATOMIC_ORDER: {
        if (ga) {
          ReactGA.event('atomicOrder', 'atomicOrder.cancel').send()
        }
        break
      }
      case GA_CANCEL_AO: {
        if (ga) {
          ReactGA.event('ao', 'ao.cancel').send()
        }
        break
      }
      case GA_PAGEVIEW: {
        const { page } = payload
        if (ga) {
          ReactGA.pageview(page).send()
        }
        break
      }
      default: {
        next(action)
        break
      }
    }
  }
}
