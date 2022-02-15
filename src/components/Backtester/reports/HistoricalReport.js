import React from 'react'
import { AutoSizer } from 'react-virtualized'
import { ExportToCsv } from 'export-to-csv'
import { formatNumber } from '@ufx-ui/utils'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import _split from 'lodash/split'

// eslint-disable-next-line import/no-extraneous-dependencies
import BFXChart from 'bfx-hf-chart'
import { AMOUNT_DECIMALS, PRICE_SIG_FIGS } from '../../../constants/precision'
import { THEMES } from '../../../redux/selectors/ui'
import Results from '../Results'
import StrategyTradesTable from '../../StrategyTradesTable'

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

const TRADE_CSV_OPTIONS = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: true,
  useTextFile: false,
  useBom: true,
}

const HistoricalReport = (opts, results, backtestData, backtestOptions, t, settingsTheme) => {
  const chartColours = CHART_THEME[settingsTheme]
  const { trades = [] } = results
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

  const onTradeExportClick = () => {
    if (_isEmpty(trades)) {
      return
    }

    const { backtestOptions: { activeMarket } } = results
    const csvExporter = new ExportToCsv({
      ...TRADE_CSV_OPTIONS,
      headers: [t('table.price'), t('table.amount'), t('table.pl'), t('table.label'), t('table.time')],
      filename: `${activeMarket}-${_split(new Date().toISOString(), '.')[0]}`,
      title: `Backtest ${activeMarket} trades report`,
    })

    const processedTrades = _map(trades, ({
      price, amount, pl, label, mts,
    }) => ({
      price: formatNumber({ number: price, significantFigures: PRICE_SIG_FIGS, useGrouping: true }),
      amount: formatNumber({ number: amount, decimals: AMOUNT_DECIMALS, useGrouping: true }),
      pl: formatNumber({ number: pl, decimals: AMOUNT_DECIMALS, useGrouping: true }),
      label,
      mts: new Date(mts).toLocaleString(),
    }))

    csvExporter.generateCsv(processedTrades)
  }

  return (
    <div className='hfui-backtester__candlechart'>
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
        onTradeExportClick={onTradeExportClick}
      />
    </div>
  )
}

export default HistoricalReport
