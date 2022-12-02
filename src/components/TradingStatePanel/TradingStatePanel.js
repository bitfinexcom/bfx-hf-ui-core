import React, {
  memo, useRef, useMemo, useCallback, Fragment,
} from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'
import { useTranslation } from 'react-i18next'

import Icon from 'react-fa'
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
import { MARKET_SHAPE } from '../../constants/prop-types-shapes'
import PanelButton from '../../ui/Panel/Panel.Button'
import CCYIcon from '../../ui/CCYIcon'
import AlgoOrdersHistoryButton from '../AlgoOrdersHistoryButton'

import './style.css'

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
}) => {
  const { currentMarket: activeFilter = {} } = savedState
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

  const setActiveFilter = (market) => {
    saveState('currentMarket', market)
  }
  const marketRef = useRef('')

  const handleSelectedFilterClick = () => {
    setActiveFilter({})
    if (marketRef?.current) {
      marketRef.current.click()
    }
  }

  const isAOsTabActive = _get(savedState, 'tab', null) === 2

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
            <p className='filter-by' key='filter-by'>
              <i className='icon-filter-active filter-icon' />
              {`${
                showMarketDropdown
                  ? t('tradingStatePanel.filterBy')
                  : t('tradingStatePanel.filteringBy')
              }:`}
            </p>
            <Fragment key='filter-market'>
              <div style={styles}>
                <MarketSelect
                  markets={markets}
                  value={activeFilter}
                  onChange={setActiveFilter}
                  renderWithFavorites
                  ref={marketRef}
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
  savedState: PropTypes.shape({
    currentMarket: PropTypes.shape(MARKET_SHAPE),
    tab: PropTypes.number,
  }),
  updateState: PropTypes.func.isRequired,
  layoutI: PropTypes.string.isRequired,
  layoutID: PropTypes.string,
  getCurrencySymbol: PropTypes.func.isRequired,
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
}

export default memo(TradingStatePanel)
