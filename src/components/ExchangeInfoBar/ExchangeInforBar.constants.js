/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import { TICKERLIST_KEYS, TICKER_KEYS } from '@ufx-ui/core'

import CCYIcon from './CCYIcon'
import { getPairFromMarket } from '../../util/market'

export const getTickerDataMapping = (getCurrencySymbol) => ({
  [TICKER_KEYS.BASE_CCY]: {
    renderer: ({ baseCcy, quoteCcy, data }) => {
      const { isPerp, uiID } = data

      return (
        isPerp ? <div className='highlight'>{uiID}</div> : (
          <>
            <div className='highlight'>{getCurrencySymbol(baseCcy)}</div>
            /
            <div className='quote-ccy'>{getCurrencySymbol(quoteCcy)}</div>
          </>
        )
      )
    },
  },
})

const getMarket = (markets, rowData) => markets?.[rowData?.id] || {}

export const getTickerListMapping = (getCurrencySymbol, markets) => ({
  [TICKERLIST_KEYS.BASE_CCY]: {
    renderer: ({ rowData = {} }) => {
      const { baseCcy } = rowData
      const market = getMarket(markets, rowData)
      const { uiID, isPerp } = market
      const id = getPairFromMarket(market, getCurrencySymbol)

      return (
        <span className='ccy-pair'>
          <CCYIcon small ccy={baseCcy} />
          <span>{isPerp ? uiID : id}</span>
        </span>
      )
    },
  },
  [TICKERLIST_KEYS.VOLUME]: {
    selector: 'volumeConverted',
  },
  [TICKERLIST_KEYS.CCY_LABELS]: {
    format: (_, __, data) => getMarket(markets, data)?.ccyLabels,
  },
})
