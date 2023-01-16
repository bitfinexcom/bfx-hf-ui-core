import ReactGA from 'react-ga4'
import { v4 } from 'uuid'

import ga from '../../constants/ga'

import { isElectronApp } from '../../config'
import { getGACustomerId, storeGACustomerId } from '../../../util/ga'

const GA_ID_ELECTRON_APP = 'G-YRD2QPKP8G'
const GA_ID_HOSTED_WEB = 'G-XC213WGP9N'

const gaID = isElectronApp ? GA_ID_ELECTRON_APP : GA_ID_HOSTED_WEB

if (!getGACustomerId()) {
  storeGACustomerId(v4())
}

ReactGA.initialize(gaID, {
  gaOptions: {
    anonymizeIp: true,
    userId: getGACustomerId(),
  },
})

export default () => {
  return () => (next) => (action = {}) => {
    const { type, payload = {} } = action

    switch (type) {
      case ga.GA_SUBMIT_ATOMIC_ORDER: {
        ReactGA.event({
          category: 'atomicOrder',
          action: 'atomicOrder.submit',
        })
        break
      }
      case ga.GA_CANCEL_ATOMIC_ORDER: {
        ReactGA.event({
          category: 'atomicOrder',
          action: 'atomicOrder.cancel',
        })
        break
      }
      case ga.GA_SUBMIT_AO: {
        ReactGA.event({
          category: 'ao',
          action: 'ao.submit',
        })
        break
      }
      case ga.GA_EDIT_AO: {
        ReactGA.event({
          category: 'ao',
          action: 'ao.edit',
        })
        break
      }
      case ga.GA_CANCEL_AO: {
        ReactGA.event({
          category: 'ao',
          action: 'ao.cancel',
        })
        break
      }
      case ga.GA_UPDATE_SETTINGS: {
        ReactGA.event({
          category: 'settings',
          action: 'settings.update',
        })
        break
      }
      case ga.GA_CREATE_STRATEGY: {
        ReactGA.event({
          category: 'strategy',
          action: 'strategy.create',
        })
        break
      }
      case ga.GA_PAGEVIEW: {
        const { page } = payload

        ReactGA.send({ hitType: 'pageview', page })
        break
      }
      default: {
        next(action)
        break
      }
    }
  }
}
