import React, { memo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import _filter from 'lodash/filter'
import _size from 'lodash/size'
import { Trades } from '@ufx-ui/core'
import {
  reduxActions,
  reduxSelectors,
  reduxConstants,
  useCommonBfxData,
} from '@ufx-ui/bfx-containers'
import { useTranslation } from 'react-i18next'

import MarketSelect from '../MarketSelect'
import Panel from '../../ui/Panel'
import './style.css'
import { getPairFromMarket } from '../../util/market'

const { trades } = reduxConstants
const { SUBSCRIPTION_CONFIG } = trades
const { WSSubscribeChannel, WSUnsubscribeChannel } = reduxActions
const { getRecentTrades, hasFetchedTrades: hasFetchedTradesSelector, isSubscribedToTrades } = reduxSelectors

const TradesTablePanel = (props) => {
  const {
    dark,
    layoutI,
    onRemove,
    moveable,
    layoutID,
    showMarket,
    removeable,
    savedState,
    markets,
    updateState,
    activeMarket,
    canChangeMarket,
    allMarketTrades,
    getCurrencySymbol,
  } = props

  const { currentMarket = activeMarket } = savedState
  const {
    base, quote, isPerp, uiID,
  } = currentMarket
  const currentPair = getPairFromMarket(activeMarket, getCurrencySymbol)

  const { symbol, dispatch, isWSConnected } = useCommonBfxData(base, quote)
  const marketData = useSelector(state => getRecentTrades(state, symbol))
  const hasFetchedTrades = useSelector(state => hasFetchedTradesSelector(state, symbol))
  const isSubscribedToSymbol = useSelector(state => isSubscribedToTrades(state, symbol))

  const { t } = useTranslation()

  useEffect(() => {
    if (isWSConnected && symbol && !isSubscribedToSymbol) {
      dispatch(WSSubscribeChannel({
        ...SUBSCRIPTION_CONFIG,
        symbol,
      }))
    }
  }, [isWSConnected, symbol, isSubscribedToSymbol, dispatch])

  const unSubscribeWSChannel = (s) => {
    const tradesUsingSymbol = _filter(allMarketTrades, (tradesState) => tradesState?.currentMarket?.wsID === s)

    // do not unsubscribe if more than one trades comp are subscribed to the symbol
    if (_size(tradesUsingSymbol) > 1) {
      return
    }

    dispatch(WSUnsubscribeChannel({
      ...SUBSCRIPTION_CONFIG,
      symbol: s,
    }))
  }

  const saveState = (param, value) => {
    updateState(layoutID, layoutI, {
      [param]: value,
    })
  }

  const onChangeMarket = (market) => {
    if (market.restID === currentMarket.restID) {
      return
    }

    const { wsID } = currentMarket
    unSubscribeWSChannel(wsID)

    saveState('currentMarket', market)
  }

  const renderMarketDropdown = () => (
    <MarketSelect
      markets={markets}
      renderWithFavorites
      key='market-dropdown'
      value={currentMarket}
      onChange={onChangeMarket}
      disabled={!canChangeMarket}
    />
  )

  const handleOnRemove = (...args) => {
    unSubscribeWSChannel(symbol)
    onRemove(...args)
  }

  return (
    <Panel
      dark={dark}
      label={t('tradesTableModal.title')}
      darkHeader={dark}
      moveable={moveable}
      onRemove={handleOnRemove}
      removeable={removeable}
      className='hfui-tradestable__wrapper'
      secondaryHeaderComponents={
        showMarket && canChangeMarket && renderMarketDropdown()
      }
      headerComponents={showMarket && !canChangeMarket && <p>{isPerp ? uiID : currentPair}</p>}
    >
      <Trades
        market={marketData}
        online={isWSConnected}
        loading={!hasFetchedTrades}
      />
    </Panel>
  )
}

TradesTablePanel.propTypes = {
  dark: PropTypes.bool,
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  showMarket: PropTypes.bool,
  savedState: PropTypes.shape({
    currentMarket: PropTypes.shape({
      base: PropTypes.string,
      quote: PropTypes.string,
    }),
  }),
  canChangeMarket: PropTypes.bool,
  allMarketTrades: PropTypes.arrayOf(PropTypes.object),
  onRemove: PropTypes.func.isRequired,
  layoutI: PropTypes.string.isRequired,
  layoutID: PropTypes.string,
  updateState: PropTypes.func.isRequired,
  markets: PropTypes.objectOf(PropTypes.object).isRequired,
  activeMarket: PropTypes.shape({
    uiID: PropTypes.string,
  }).isRequired,
  getCurrencySymbol: PropTypes.func.isRequired,
}

TradesTablePanel.defaultProps = {
  dark: false,
  savedState: {},
  moveable: true,
  removeable: true,
  showMarket: false,
  allMarketTrades: [],
  canChangeMarket: true,
  layoutID: '',
}

export default memo(TradesTablePanel)
