import React, {
  memo, useRef, useMemo, useCallback, Fragment,
} from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'
import _pickBy from 'lodash/pickBy'
import _map from 'lodash/map'
import _values from 'lodash/values'
import _includes from 'lodash/includes'
import { useTranslation } from 'react-i18next'

import {
  getCorrectIconNameOfPerpCcy,
  getPairFromMarket,
} from '../../util/market'
import Panel from '../../ui/Panel'
import PositionsTable from '../PositionsTable'
import AtomicOrdersTable from '../AtomicOrdersTable'
import AlgoOrdersTable from '../AlgoOrdersTable'
import BalancesTable from '../BalancesTable'
import MarketSelect from '../MarketSelect'
import {
  MARKET_SHAPE, ORDER_SHAPE, POSITION_SHAPE,
} from '../../constants/prop-types-shapes'
import PanelButton from '../../ui/Panel/Panel.Button'
import CCYIcon from '../../ui/CCYIcon'
import AlgoOrdersHistoryButton from '../AlgoOrdersHistoryButton'

import './style.css'

const PANEL_MAPPING = {
  POSITIONS: 0,
  ATOMIC_ORDERS: 1,
  ALGO_ORDERS: 2,
  BALANCES: 3,
}

const TradingStatePanel = ({
  dark,
  onRemove,
  moveable,
  removeable,
  getPositionsCount,
  getAtomicOrdersCount,
  getAlgoOrdersCount,
  markets,
  savedState,
  updateState,
  layoutID,
  layoutI,
  getCurrencySymbol,
  currentMode,
  algoOrders,
  positions,
  atomicOrders,
}) => {
  const currentMarket = _get(savedState, 'currentMarket', {})
  const activeFilter = _get(currentMarket, currentMode, {})
  const positionsCount = getPositionsCount(activeFilter)
  const atomicOrdersCount = getAtomicOrdersCount(activeFilter)
  const algoOrdersCount = getAlgoOrdersCount(activeFilter)
  const { t } = useTranslation()

  const saveState = useCallback(
    (param, value) => {
      updateState(layoutID, layoutI, {
        [param]: value,
      })
    },
    [layoutID, layoutI, updateState],
  )

  const onTabChange = useCallback(
    (tab) => {
      saveState('tab', tab)
    },
    [saveState],
  )

  const filterableMarkets = useMemo(() => {
    const activeTab = _get(savedState, 'tab', null)

    // Processing markets for algo orders
    if (activeTab === PANEL_MAPPING.ALGO_ORDERS) {
      const algoOrderSymbols = _map(_values(algoOrders), 'args.symbol')
      const filteredMarkets = _pickBy(markets, (_, key) => {
        return _includes(algoOrderSymbols, key)
      })
      return filteredMarkets
    }

    // Processing markets for positions
    if (activeTab === PANEL_MAPPING.POSITIONS) {
      const positionSymbols = _map(_values(positions), 'symbol')
      const filteredMarkets = _pickBy(markets, (_, key) => {
        return _includes(positionSymbols, key)
      })
      return filteredMarkets
    }

    // Processing markets for atomic orders
    if (activeTab === PANEL_MAPPING.ATOMIC_ORDERS) {
      const atomicSymbols = _map(_values(atomicOrders), 'symbol')
      const filteredMarkets = _pickBy(markets, (_, key) => {
        return _includes(atomicSymbols, key)
      })
      return filteredMarkets
    }

    return markets
  }, [markets, algoOrders, atomicOrders, positions, savedState])

  const setActiveFilter = (market) => {
    saveState('currentMarket', {
      ...currentMarket,
      [currentMode]: market,
    })
  }
  const marketRef = useRef('')

  const handleSelectedFilterClick = () => {
    setActiveFilter({})
    if (marketRef?.current) {
      marketRef.current.click()
    }
  }

  const isAOsTabActive = _get(savedState, 'tab', null) === PANEL_MAPPING.ALGO_ORDERS

  const showMarketDropdown = _isEmpty(activeFilter)

  const styles = useMemo(
    () => ({ display: showMarketDropdown ? 'block' : 'none' }),
    [showMarketDropdown],
  )

  const { isPerp, uiID, base } = activeFilter
  const activeFilterID = isPerp
    ? uiID
    : getPairFromMarket(activeFilter, getCurrencySymbol)

  return (
    <Panel
      label={t('tradingStatePanel.title')}
      dark={dark}
      darkHeader={dark}
      className='hfui-tradingstatepanel__wrapper'
      moveable={moveable}
      removeable={removeable}
    >
      <Panel
        onRemove={onRemove}
        darkHeader
        moveable={false}
        removeable={false}
        forcedTab={savedState.tab}
        onTabChange={onTabChange}
        extraIcons={(
          <div className='hfui-tradingstatepanel__options'>
            <Fragment key='filter-market'>
              <div style={styles}>
                <MarketSelect
                  markets={filterableMarkets}
                  value={activeFilter}
                  onChange={setActiveFilter}
                  renderWithFavorites
                  ref={marketRef}
                  placeholder={t('tradingStatePanel.filterBy')}
                  className='hfui-tradingstatepanel__options-market-select'
                />
              </div>
              {!showMarketDropdown && (
                <PanelButton
                  onClick={handleSelectedFilterClick}
                  text={activeFilterID}
                  isActive
                  icon={(
                    <CCYIcon
                      ccy={isPerp ? getCorrectIconNameOfPerpCcy(base) : base}
                      className='hfui-tradingstatepanel__ccy-icon'
                    />
                  )}
                />
              )}
            </Fragment>
            {isAOsTabActive && <AlgoOrdersHistoryButton />}
          </div>
        )}
      >
        <PositionsTable
          renderedInTradingState
          htmlKey='Positions'
          tabtitle={t('tradingStatePanel.positionsTab')}
          count={positionsCount}
          activeFilter={activeFilter}
        />
        <AtomicOrdersTable
          renderedInTradingState
          htmlKey='Atomics'
          tabtitle={t('tradingStatePanel.atomicsTab')}
          count={atomicOrdersCount}
          activeFilter={activeFilter}
        />
        <AlgoOrdersTable
          renderedInTradingState
          htmlKey='Algos'
          tabtitle={t('tradingStatePanel.algosTab')}
          count={algoOrdersCount}
          activeFilter={activeFilter}
        />
        <BalancesTable
          renderedInTradingState
          htmlKey='Balances'
          tabtitle={t('tradingStatePanel.balancesTab')}
          hideZeroBalances
          activeFilter={activeFilter}
        />
      </Panel>
    </Panel>
  )
}

TradingStatePanel.propTypes = {
  dark: PropTypes.bool,
  moveable: PropTypes.bool,
  onRemove: PropTypes.func,
  removeable: PropTypes.bool,
  getPositionsCount: PropTypes.func,
  getAtomicOrdersCount: PropTypes.func,
  getAlgoOrdersCount: PropTypes.func,
  markets: PropTypes.objectOf(PropTypes.shape(MARKET_SHAPE)).isRequired,
  algoOrders: PropTypes.objectOf(PropTypes.shape(ORDER_SHAPE)).isRequired,
  positions: PropTypes.objectOf(PropTypes.shape(POSITION_SHAPE)),
  atomicOrders: PropTypes.objectOf(PropTypes.shape(ORDER_SHAPE)),
  savedState: PropTypes.shape({
    currentMarket: PropTypes.shape(MARKET_SHAPE),
    tab: PropTypes.number,
  }),
  updateState: PropTypes.func.isRequired,
  layoutI: PropTypes.string.isRequired,
  layoutID: PropTypes.string,
  getCurrencySymbol: PropTypes.func.isRequired,
  currentMode: PropTypes.string.isRequired,
}

TradingStatePanel.defaultProps = {
  dark: true,
  moveable: false,
  removeable: false,
  getPositionsCount: () => {},
  getAtomicOrdersCount: () => {},
  getAlgoOrdersCount: () => {},
  onRemove: () => {},
  savedState: {},
  layoutID: '',
  positions: {},
  atomicOrders: {},
}

export default memo(TradingStatePanel)
