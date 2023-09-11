import React, {
  memo,
  useRef,
  useMemo,
  useCallback,
  Fragment,
  useEffect,
} from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'
import _pickBy from 'lodash/pickBy'
import _map from 'lodash/map'
import _values from 'lodash/values'
import _includes from 'lodash/includes'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'

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
  MARKET_SHAPE,
  ORDER_SHAPE,
  POSITION_SHAPE,
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

const STATE_KEYS = {
  CURRENT_MARKET: 'currentMarket',
  TAB: 'tab',
  POSITIONS_TABLE: 'positionsTable',
  ATOMIC_ORDERS_TABLE: 'atomicOrdersTable',
  ALGO_ORDERS_TABLE: 'algoOrdersTable',
  BALANCES_TABLE: 'balancesTable',
}

const TradingStatePanel = ({
  dark,
  onRemove,
  moveable,
  removeable,
  getPositionsCount,
  getAtomicOrdersCount,
  markets,
  savedState,
  updateState,
  getCurrencySymbol,
  currentMode,
  algoOrders,
  positions,
  atomicOrders,
  isHistoryActive,
  setShowAOsHistory,
  getAlgoOrdersCount,
}) => {
  const currentMarket = _get(savedState, STATE_KEYS.CURRENT_MARKET, {})
  const activeFilter = _get(currentMarket, currentMode, {})
  const positionsCount = getPositionsCount(activeFilter)
  const atomicOrdersCount = getAtomicOrdersCount(activeFilter)
  const algoOrdersCount = getAlgoOrdersCount(activeFilter)

  const { t } = useTranslation()

  const activeTab = _get(savedState, STATE_KEYS.TAB, null)

  const saveState = useCallback(
    (param, value) => {
      updateState({
        [param]: value,
      })
    },
    [updateState],
  )

  const onTabChange = useCallback(
    (tab) => {
      saveState(STATE_KEYS.TAB, tab)
    },
    [saveState],
  )

  const updateTableState = useCallback(
    (table) => (newState) => {
      saveState(table, {
        ..._get(savedState, table, {}),
        ...newState,
      })
    },
    [saveState, savedState],
  )

  const filterableMarkets = useMemo(() => {
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
  }, [markets, algoOrders, atomicOrders, positions, activeTab])

  const setActiveFilter = (market) => {
    saveState(STATE_KEYS.CURRENT_MARKET, {
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

  const isAOsTabActive = activeTab === PANEL_MAPPING.ALGO_ORDERS

  const showMarketDropdown = _isEmpty(activeFilter)

  const styles = useMemo(
    () => ({ display: showMarketDropdown ? 'block' : 'none' }),
    [showMarketDropdown],
  )

  const { isPerp, uiID, base } = activeFilter
  const activeFilterID = isPerp
    ? uiID
    : getPairFromMarket(activeFilter, getCurrencySymbol)

  useEffect(() => {
    setShowAOsHistory(false)
  }, [activeTab, setShowAOsHistory])

  return (
    <Panel
      label={t('tradingStatePanel.title')}
      dark={dark}
      darkHeader={dark}
      className='hfui-tradingstatepanel__wrapper'
      moveable={moveable}
      removeable={removeable}
    >
      <OutsideClickHandler
        onOutsideClick={() => isHistoryActive && setShowAOsHistory(false)}
      >
        <Panel
          onRemove={onRemove}
          darkHeader
          moveable={false}
          removeable={false}
          forcedTab={activeTab}
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
            tableState={_get(savedState, STATE_KEYS.POSITIONS_TABLE, {})}
            updateTableState={updateTableState(STATE_KEYS.POSITIONS_TABLE)}
          />
          <AtomicOrdersTable
            renderedInTradingState
            htmlKey='Atomics'
            tabtitle={t('tradingStatePanel.atomicsTab')}
            count={atomicOrdersCount}
            activeFilter={activeFilter}
            tableState={_get(savedState, STATE_KEYS.ATOMIC_ORDERS_TABLE, {})}
            updateTableState={updateTableState(STATE_KEYS.ATOMIC_ORDERS_TABLE)}
          />
          <AlgoOrdersTable
            renderedInTradingState
            htmlKey='Algos'
            tabtitle={t('tradingStatePanel.algosTab')}
            count={!isHistoryActive && algoOrdersCount}
            activeFilter={activeFilter}
            tableState={_get(savedState, STATE_KEYS.ALGO_ORDERS_TABLE, {})}
            updateTableState={updateTableState(STATE_KEYS.ALGO_ORDERS_TABLE)}
          />
          <BalancesTable
            renderedInTradingState
            htmlKey='Balances'
            tabtitle={t('tradingStatePanel.balancesTab')}
            hideZeroBalances
            activeFilter={activeFilter}
            tableState={_get(savedState, STATE_KEYS.BALANCES_TABLE, {})}
            updateTableState={updateTableState(STATE_KEYS.BALANCES_TABLE)}
          />
        </Panel>
      </OutsideClickHandler>
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
  markets: PropTypes.objectOf(PropTypes.shape(MARKET_SHAPE)).isRequired,
  algoOrders: PropTypes.objectOf(PropTypes.shape(ORDER_SHAPE)).isRequired,
  getAlgoOrdersCount: PropTypes.func.isRequired,
  positions: PropTypes.objectOf(PropTypes.shape(POSITION_SHAPE)),
  atomicOrders: PropTypes.objectOf(PropTypes.shape(ORDER_SHAPE)),
  savedState: PropTypes.shape({
    currentMarket: PropTypes.shape(MARKET_SHAPE),
    tab: PropTypes.number,
  }),
  updateState: PropTypes.func.isRequired,
  getCurrencySymbol: PropTypes.func.isRequired,
  currentMode: PropTypes.string.isRequired,
  setShowAOsHistory: PropTypes.func.isRequired,
  isHistoryActive: PropTypes.bool.isRequired,
}

TradingStatePanel.defaultProps = {
  dark: true,
  moveable: false,
  removeable: false,
  getPositionsCount: () => {},
  getAtomicOrdersCount: () => {},
  onRemove: () => {},
  savedState: {},
  positions: {},
  atomicOrders: {},
}

export default memo(TradingStatePanel)
