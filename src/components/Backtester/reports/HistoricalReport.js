import React from 'react'
import { AutoSizer } from 'react-virtualized'
import _map from 'lodash/map'

// eslint-disable-next-line import/no-extraneous-dependencies
import BFXChart from 'bfx-hf-chart'
import { THEMES } from '../../../redux/selectors/ui'
import Results from '../Results'
import StrategyTradesTable from '../../StrategyTradesTable'
import { onTradeExportClick } from './HistoricalReport.helpers'

const CHART_THEME = {
  [THEMES.LIGHT]: {
    bgColor: '#efefef',
    AXIS_COLOR: '#444',
    AXIS_TICK_COLOR: '#00000000',
    AXIS_LABEL_COLOR: '#000e1a',
    OHLC_LABEL_COLOR: '#000e1a',
    OHLC_LABEL_VALUE_COLOR: '#414f5a',
    RISING_VOL_FILL: 'rgba(9, 220, 34, 0.05)',
    FALLING_VOL_FILL: 'rgba(94, 32, 35, 0.05)',
  },
  [THEMES.DARK]: {
    bgColor: '#102331',
    AXIS_COLOR: '#444',
    AXIS_TICK_COLOR: '#00000000',
  },
}

const HistoricalReport = (opts, results, backtestData, backtestOptions, t, settingsTheme) => {
  const chartColours = CHART_THEME[settingsTheme]
  const { trades = [], backtestOptions: { activeMarket } = {} } = results
  const { symbol } = backtestOptions
  const { indicators, onAddIndicator, onDeleteIndicator } = opts
  const { candles = [] } = backtestData
  const { tf } = backtestOptions
  const hasCandles = candles.length !== 0

  // convert candles to array for the chart
  const candleArr = _map(candles, c => (
    [
      c.mts,
      c.open,
      c.close,
      c.high,
      c.low,
      c.volume,
    ]
  ))

  return (
    <div className='hfui-backtester__candlechart'>
      <span
        className='link-button'
        onClick={() => onTradeExportClick(trades, results, activeMarket || symbol, t)}
      >
        {t('strategyEditor.exportCSV')}
      </span>
      <Results
        results={results}
        execRunning={false}
      />
      {hasCandles && (
        <AutoSizer disableHeight style={{ height: 400 }}>
          {({ width, height = 400 }) => (
            <BFXChart
              indicators={indicators}
              candles={candleArr}
              trades={trades}
              width={width}
              height={height}
              onAddIndicator={onAddIndicator}
              onDeleteIndicator={onDeleteIndicator}
              isSyncing={false}
              candleLoadingThreshold={3} // we always get 1 candle when sub'ing
              bgColor={chartColours.bgColor}
              config={chartColours}
              candleWidth={tf}
              disableToolbar
              showMarketLabel={false}
            />
          )}
        </AutoSizer>
      )}
      <StrategyTradesTable
        label={t('tradesTableModal.title')}
        trades={trades}
        onTradeClick={() => { }}
      />
    </div>
  )
}

export default HistoricalReport
