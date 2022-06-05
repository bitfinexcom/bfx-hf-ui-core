import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import _find from 'lodash/find'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { getThemeSetting } from '../../redux/selectors/ui'
import Panel from '../../ui/Panel'
import Chart from '../Chart'
import { prepareTVIndicators } from './StrategyLiveChart.helpers'
import timeFrames, { TIMEFRAME_INTERVAL_MAPPING } from '../../util/time_frames'

import './style.css'

const StrategyLiveChart = ({
  results,
  indicators,
  markets,
  fullscreenChart,
  exitFullscreenChart,
  strategy: { strategyOptions: { timeframe, symbol } },
}) => {
  const { t } = useTranslation()
  const { trades = [], backtestOptions: { activeMarket } = {} } = results
  const settingsTheme = useSelector(getThemeSetting)
  const chartIndicators = prepareTVIndicators(indicators)
  const interval = TIMEFRAME_INTERVAL_MAPPING[timeframe] || '15'

  const activeMarketObject = _find(markets, (market) => market.wsID === activeMarket, null) || symbol

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
  markets: PropTypes.objectOf(PropTypes.object).isRequired, // eslint-disable-line
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
    }),
  }).isRequired,
  indicators: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  ), // eslint-disable-line
  results: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.object,
      PropTypes.number,
      PropTypes.string,
    ]),
  ),
  fullscreenChart: PropTypes.bool.isRequired,
  exitFullscreenChart: PropTypes.func.isRequired,
}

StrategyLiveChart.defaultProps = {
  indicators: [],
  results: {},
}

export default memo(StrategyLiveChart)
