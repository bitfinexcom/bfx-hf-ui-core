import React, { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import _isEmpty from 'lodash/isEmpty'

import { getThemeSetting } from '../../redux/selectors/ui'
import Panel from '../../ui/Panel'
import Chart from '../Chart'
import {
  getStrategyMarket,
  prepareTVIndicators,
} from './StrategyLiveChart.helpers'
import { TIMEFRAME_INTERVAL_MAPPING } from '../../util/time_frames'
import { getPositionTooltip } from '../../util/chart'
import {
  INDICATORS_ARRAY_SHAPE,
  MARKET_SHAPE,
  STRATEGY_TRADE_SHAPE,
} from '../../constants/prop-types-shapes'
import PanelIconButton from '../../ui/Panel/Panel.IconButton'

import './style.css'

const StrategyLiveChart = ({
  indicators,
  markets,
  fullscreenChart,
  exitFullscreenChart,
  options,
  lastOpenPosition,
  trades,
  isBacktest,
}) => {
  const {
    timeframe,
    symbol,
    candleSeed,
    executionId,
    start,
    end,
  } = options

  const chartRange = useMemo(() => {
    if (start || end) {
      return {
        start,
        end,
        candleSeed,
      }
    }
    return {}
  }, [end, start, candleSeed])
  const { t } = useTranslation()
  const settingsTheme = useSelector(getThemeSetting)
  const chartIndicators = useMemo(
    () => prepareTVIndicators(indicators),
    [indicators],
  )
  const interval = isBacktest
    ? TIMEFRAME_INTERVAL_MAPPING[timeframe] || '15'
    : '1'

  const {
    wsID, uiID, base, quote, isPerp,
  } = getStrategyMarket(markets, symbol)

  const chartMarket = useMemo(
    () => ({
      wsID,
      uiID,
      base,
      quote,
      isPerp,
    }),
    [base, quote, uiID, wsID, isPerp],
  )

  const position = useMemo(() => {
    if (_isEmpty(lastOpenPosition)) {
      return null
    }

    const processedPosition = {
      ...lastOpenPosition,
      basePrice: lastOpenPosition?.entryPrice,
      amount: parseFloat(lastOpenPosition?.amount),
      realizedPnl: parseFloat(lastOpenPosition?.realizedPnl),
      pl: parseFloat(lastOpenPosition?.realizedPnl),
    }

    return {
      ...processedPosition,
      tooltip: getPositionTooltip(processedPosition, {
        base,
        quote,
        t,
      }),
    }
  }, [lastOpenPosition, base, quote, t])

  return (
    <Panel
      removeable={false}
      moveable={false}
      hideIcons={!fullscreenChart}
      dark
      darkHeader
      extraIcons={(
        <PanelIconButton
          onClick={exitFullscreenChart}
          icon={(
            <i
              key='exit-fullscreen'
              className='icon-move toggle-fullscreen'
              title={t('strategyEditor.exitFullscreenChartBtn')}
            />
          )}
        />
      )}
      fullscreen={fullscreenChart}
      onExitFullscreen={exitFullscreenChart}
    >
      {/* We have to use key prop for correct Chart rerender when strategy changed
          https://medium.com/@albertogasparin/forcing-state-reset-on-a-react-component-by-using-the-key-prop-14b36cd7448e
      */}
      {chartMarket && !_isEmpty(indicators) ? (
        <Chart
          market={chartMarket}
          theme={settingsTheme}
          layoutI={`strategy-editor-${executionId}`}
          indicators={chartIndicators}
          interval={interval}
          trades={trades}
          position={position}
          hideResolutions
          hideDeleteIndicator
          hideIndicators
          isStrategyChart
          chartRange={chartRange}
          key={executionId}
        />
      ) : (
        <p>{t('strategyEditor.noIndicators')}</p>
      )}
    </Panel>
  )
}

StrategyLiveChart.propTypes = {
  markets: PropTypes.arrayOf(PropTypes.shape(MARKET_SHAPE)).isRequired,
  options: PropTypes.shape({
    timeframe: PropTypes.string,
    symbol: PropTypes.string,
    end: PropTypes.number,
    start: PropTypes.number,
    candleSeed: PropTypes.number,
    executionId: PropTypes.string,
  }).isRequired,
  indicators: INDICATORS_ARRAY_SHAPE,
  trades: PropTypes.arrayOf(PropTypes.shape(STRATEGY_TRADE_SHAPE)).isRequired,
  fullscreenChart: PropTypes.bool.isRequired,
  exitFullscreenChart: PropTypes.func.isRequired,
  lastOpenPosition: PropTypes.object, // eslint-disable-line
  isBacktest: PropTypes.bool,
}

StrategyLiveChart.defaultProps = {
  indicators: [],
  isBacktest: false,
  lastOpenPosition: null,
}

export default memo(StrategyLiveChart)
