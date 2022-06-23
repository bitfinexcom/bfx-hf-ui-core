import React, { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { getThemeSetting } from '../../redux/selectors/ui'
import Panel from '../../ui/Panel'
import Chart from '../Chart'
import { prepareTVIndicators, getStrategyMarket } from './StrategyLiveChart.helpers'
import timeFrames, { TIMEFRAME_INTERVAL_MAPPING } from '../../util/time_frames'

import './style.css'

const StrategyLiveChart = ({
  indicators,
  markets,
  fullscreenChart,
  exitFullscreenChart,
  strategy,
  trades,
  isBacktest,
}) => {
  const {
    strategyOptions: {
      timeframe, symbol, startDate, endDate,
    },
    id, startedOn, stoppedOn,
  } = strategy
  const start = isBacktest ? new Date(startDate).getTime() : startedOn
  const end = isBacktest ? new Date(endDate).getTime() : stoppedOn
  const chartRange = useMemo(() => ({
    start,
    end,
  }), [end, start])
  const { t } = useTranslation()
  const settingsTheme = useSelector(getThemeSetting)
  const chartIndicators = useMemo(() => prepareTVIndicators(indicators), [indicators])
  const interval = TIMEFRAME_INTERVAL_MAPPING[timeframe] || '15'

  const {
    wsID, uiID, base, quote,
  } = getStrategyMarket(markets, symbol?.wsID)
  const chartMarket = useMemo(() => ({
    wsID,
    uiID,
    base,
    quote,
  }), [base, quote, uiID, wsID])

  return (
    <Panel
      removeable={false}
      moveable={false}
      hideIcons={!fullscreenChart}
      dark
      darkHeader
      extraIcons={[
        <span
          key='exit-fullscreen'
          type='button'
          className='icon-move toggle-fullscreen'
          onClick={exitFullscreenChart}
          title={t('strategyEditor.exitFullscreenChartBtn')}
        />,
      ]}
      fullscreen={fullscreenChart}
      onExitFullscreen={exitFullscreenChart}
    >
      {chartMarket && (
        <Chart
          market={chartMarket}
          theme={settingsTheme}
          layoutI={`strategy-editor-${id}`}
          indicators={chartIndicators}
          interval={interval}
          trades={trades}
          hideResolutions
          chartRange={chartRange}
        />
      )}
    </Panel>
  )
}

StrategyLiveChart.propTypes = {
  markets: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
  strategy: PropTypes.shape({
    strategyOptions: PropTypes.shape({
      symbol: PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
          PropTypes.bool,
          PropTypes.number,
        ]),
      ).isRequired,
      timeframe: PropTypes.oneOf(timeFrames).isRequired,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
    id: PropTypes.string.isRequired,
    startedOn: PropTypes.number,
    stoppedOn: PropTypes.string,
  }).isRequired,
  indicators: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  ), // eslint-disable-line
  trades: PropTypes.array, // eslint-disable-line
  fullscreenChart: PropTypes.bool.isRequired,
  exitFullscreenChart: PropTypes.func.isRequired,
  isBacktest: PropTypes.bool,
}

StrategyLiveChart.defaultProps = {
  indicators: [],
  isBacktest: false,
}

export default memo(StrategyLiveChart)
