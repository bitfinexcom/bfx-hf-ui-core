// eslint-disable
import React, { useMemo } from 'react'
import { AutoSizer } from 'react-virtualized'
import _find from 'lodash/find'

// eslint-disable-next-line import/no-extraneous-dependencies
// import BFXChart from 'bfx-hf-chart'
import Results from '../Results'
import StrategyTradesTable from '../../StrategyTradesTable'
import { onTradeExportClick, prepareTVIndicators } from './HistoricalReport.helpers'
import Chart from '../../Chart'
import Panel from '../../../ui/Panel'
import { TIMEFRAME_INTERVAL_MAPPING } from '../../../util/time_frames'

const FULL_SCREEN_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  border: 'none',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  zIndex: 999999,
}

const HistoricalReport = (opts, results, backtestData, backtestOptions, t, settingsTheme, full, setFull) => {
  const { trades = [], backtestOptions: { activeMarket } = {} } = results
  const { markets, formState } = opts

  const activeMarketObject = _find(markets, (market) => market.wsID === activeMarket, null)
  const { symbol } = backtestOptions
  const { indicators } = opts
  const { candles = [] } = backtestData
  const hasCandles = candles.length !== 0

  // convert candles to array for the chart
  // const candleArr = _map(candles, c => (
  //   [
  //     c.mts,
  //     c.open,
  //     c.close,
  //     c.high,
  //     c.low,
  //     c.volume,
  //   ]
  // ))

  const chartIndicators = useMemo(() => prepareTVIndicators(indicators), [indicators])

  const interval = TIMEFRAME_INTERVAL_MAPPING[formState?.selectedTimeFrame] || '15'

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
        activeMarketObject && (
        <AutoSizer disableHeight style={{ height: 400 }}>
          {({ width, height = 400 }) => (
            <div
              style={full
                ? FULL_SCREEN_STYLES
                : { width, height }}
              className='hfui-backtester__chart'
            >
              <Panel
                label=''
                removeable={false}
                moveable={false}
                extraIcons={[
                  <span
                    key='toggle-fullscreen'
                    type='button'
                    className='icon-move toggle-fullscreen'
                    onClick={() => setFull(!full)}
                    title='Toggle Fullscreen'
                  />,
                ]}
              >
                <Chart
                  market={activeMarketObject}
                  theme={settingsTheme}
                  layoutI='strategy-editor'
                  indicators={chartIndicators}
                  interval={interval}
                  trades={trades}
                  hideResolutions
                />
              </Panel>
            </div>
          )}
        </AutoSizer>
        )
      // <AutoSizer disableHeight style={{ height: 400 }}>
      //   {({ width, height = 400 }) => (
      //     <BFXChart
      //       indicators={indicators}
      //       candles={candleArr}
      //       trades={trades}
      //       width={width}
      //       height={height}
      //       // onAddIndicator={onAddIndicator}
      //       // onDeleteIndicator={onDeleteIndicator}
      //       isSyncing={false}
      //       candleLoadingThreshold={3} // we always get 1 candle when sub'ing
      //       // bgColor={chartColours.bgColor}
      //       // config={chartColours}
      //       // candleWidth={tf}
      //       disableToolbar
      //       showMarketLabel={false}
      //     />
      //   )}
      // </AutoSizer>
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
