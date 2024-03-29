import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { THEMES } from '../../redux/selectors/ui'
import Panel from '../../ui/Panel'
import Chart from '../Chart'
import MarketSelect from '../MarketSelect'
import { getPairFromMarket } from '../../util/market'
import { MARKET_SHAPE } from '../../constants/prop-types-shapes'
import useWidgetMarket from '../../hooks/useWidgetMarket'

import './style.css'

const ChartPanel = ({
  dark,
  label,
  onRemove,
  moveable,
  removeable,
  showChartMarket,
  markets,
  canChangeMarket,
  activeMarket,
  savedState: { currentMarket: savedMarket },
  updateState,
  layoutI,
  showMarket,
  getCurrencySymbol,
  settingsTheme,
}) => {
  const currentMarket = useWidgetMarket(savedMarket, activeMarket)
  const currentPair = getPairFromMarket(currentMarket, getCurrencySymbol)
  const { isPerp, uiID } = currentMarket

  const onChangeMarket = (market) => {
    if (market.restID === currentMarket.restID) {
      return
    }

    // setCurrentMarket(market)
    updateState({
      currentMarket: market,
    })
  }

  const { t } = useTranslation()

  const renderMarketDropdown = () => {
    return (
      <MarketSelect
        markets={markets}
        value={currentMarket}
        disabled={!canChangeMarket}
        onChange={onChangeMarket}
        renderWithFavorites
      />
    )
  }

  return (
    <Panel
      dark={dark}
      label={label || t('chartModal.title')}
      darkHeader={dark}
      onRemove={onRemove}
      moveable={moveable}
      removeable={removeable}
      showChartMarket={showChartMarket}
      chartMarketSelect={
        showChartMarket && canChangeMarket && renderMarketDropdown()
      }
      headerComponents={
        showMarket && !canChangeMarket && <p>{isPerp ? uiID : currentPair}</p>
      }
      className='hfui-chart__wrapper'
    >
      <Chart market={currentMarket} theme={settingsTheme} layoutI={layoutI} />
    </Panel>
  )
}

ChartPanel.propTypes = {
  dark: PropTypes.bool,
  label: PropTypes.string,
  onRemove: PropTypes.func,
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  activeMarket: PropTypes.shape(MARKET_SHAPE),
  updateState: PropTypes.func,
  canChangeMarket: PropTypes.bool,
  showChartMarket: PropTypes.bool,
  showMarket: PropTypes.bool,
  layoutI: PropTypes.string.isRequired,
  savedState: PropTypes.shape({
    currentMarket: PropTypes.shape(MARKET_SHAPE),
  }),
  markets: PropTypes.objectOf(PropTypes.shape(MARKET_SHAPE)),
  getCurrencySymbol: PropTypes.func.isRequired,
  settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]),
}

ChartPanel.defaultProps = {
  dark: true,
  label: null,
  markets: [],
  savedState: {},
  moveable: true,
  removeable: true,
  onRemove: () => {},
  activeMarket: {
    base: 'BTC',
    quote: 'USD',
    restID: 'tBTCUSD',
  },
  updateState: () => {},
  showChartMarket: false,
  canChangeMarket: false,
  showMarket: false,
  settingsTheme: THEMES.DARK,
}

export default memo(ChartPanel)
