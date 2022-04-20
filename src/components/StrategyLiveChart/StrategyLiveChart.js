import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import _find from 'lodash/find'
import PropTypes from 'prop-types'

import { getThemeSetting } from '../../redux/selectors/ui'
import Panel from '../../ui/Panel'
import Chart from '../Chart'
import { prepareTVIndicators } from './StrategyLiveChart.helpers'
import timeFrames, { TIMEFRAME_INTERVAL_MAPPING } from '../../util/time_frames'

const StrategyLiveChart = ({
  results, indicators, markets, timeframe, symbol,
}) => {
  const { trades = [], backtestOptions: { activeMarket } = {} } = results
  const settingsTheme = useSelector(getThemeSetting)
  const chartIndicators = prepareTVIndicators(indicators)
  const interval = TIMEFRAME_INTERVAL_MAPPING[timeframe] || '15'

  const activeMarketObject = _find(
    markets,
    (market) => market.wsID === activeMarket,
    null,
  ) || symbol

  return (
    <Panel
      removeable={false}
      moveable={false}
      hideIcons
      dark
      darkHeader
    >
      {activeMarketObject && (
        <Chart
          market={activeMarketObject}
          theme={settingsTheme}
          layoutI='strategy-editor'
          indicators={chartIndicators}
          interval={interval}
          trades={trades}
          hideResolutions
        />
      )}
    </Panel>
  )
}

StrategyLiveChart.propTypes = {
  markets: PropTypes.objectOf(PropTypes.object).isRequired,
  symbol: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.bool,
      PropTypes.number,
    ]),
  ).isRequired,
  timeframe: PropTypes.oneOf(timeFrames).isRequired,
  indicators: PropTypes.arrayOf(PropTypes.object),
  results: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.array, PropTypes.bool, PropTypes.object, PropTypes.number, PropTypes.string,
  ])),
}

StrategyLiveChart.defaultProps = {
  indicators: [],
  results: {},
}

export default memo(StrategyLiveChart)
