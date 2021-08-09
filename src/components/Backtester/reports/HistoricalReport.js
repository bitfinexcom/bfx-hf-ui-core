import React from 'react'
import _find from 'lodash/find'

import Results from '../Results'
import StrategyTradesTable from '../../StrategyTradesTable'
import Chart from '../../Chart'

const HistoricalReport = (opts, results, backtestData, backtestOptions) => {
  const { trades = [] } = results
  const { activeMarket } = backtestOptions
  const { markets } = opts
  const activeMarketObject = _find(markets, (market) => market.wsID === activeMarket, null)
  return (
    <div className='hfui-backtester__candlechart'>
      <Results
        results={results}
        execRunning={false}
      />
      {activeMarketObject && (
      <div className='hfui-backtester__chart'>
        <Chart market={activeMarketObject} />
      </div>
      )}
      <StrategyTradesTable
        label='Trades'
        trades={trades}
        onTradeClick={() => {}}
      />

    </div>
  )
}

export default HistoricalReport
