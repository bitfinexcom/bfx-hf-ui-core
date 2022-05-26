/* eslint-disable react/forbid-prop-types */
import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import _filter from 'lodash/filter'
import _size from 'lodash/size'
import { Checkbox } from '@ufx-ui/core'
import {
  useCommonBfxData,
  reduxActions,
  reduxConstants,
  reduxSelectors,
} from '@ufx-ui/bfx-containers'
import { useTranslation } from 'react-i18next'

import routes from '../../constants/routes'
import MarketSelect from '../MarketSelect'
import OrderBook from '../OrderBook'
import PanelSettings from '../../ui/PanelSettings'
import Panel from '../../ui/Panel'

import './style.css'
import { getPairFromMarket } from '../../util/market'

const { WSSubscribeChannel, WSUnsubscribeChannel } = reduxActions
const { SUBSCRIPTION_CONFIG } = reduxConstants
const {
  getBookAsks,
  getBookBids,
  getBookpAsks,
  getBookpBidsDesc,
  getBooktAsks,
  getBooktBids,
  getBookSnapshotReceived,
  isSubscribedToBook,
} = reduxSelectors

const OrderBookPanel = (props) => {
  const isTradingTerminal = window.location.pathname === routes.tradingTerminal.path

  const {
    onRemove, showMarket, canChangeStacked, moveable,
    removeable, dark, savedState, activeMarket,
    markets, canChangeMarket, layoutID, layoutI, updateState, allMarketBooks, getCurrencySymbol,
  } = props
  const {
    sumAmounts = true,
    stackedView = true,
    currentMarket = activeMarket,
  } = savedState
  const bookMarket = isTradingTerminal ? activeMarket : currentMarket
  const {
    base, quote, isPerp, uiID,
  } = bookMarket
  const currentPair = getPairFromMarket(activeMarket, getCurrencySymbol)

  const [settingsOpen, setSettingsOpen] = useState(false)

  const {
    isWSConnected,
    symbol,
    dispatch,
  } = useCommonBfxData(base, quote)

  const snapshotReceived = useSelector(state => getBookSnapshotReceived(state, symbol))
  const asks = useSelector(state => getBookAsks(state, symbol))
  const bids = useSelector(state => getBookBids(state, symbol))
  const pAsks = useSelector(state => getBookpAsks(state, symbol))
  const pBids = useSelector(state => getBookpBidsDesc(state, symbol))
  const tAsks = useSelector(state => getBooktAsks(state, symbol))
  const tBids = useSelector(state => getBooktBids(state, symbol))
  const isSubscribedToSymbol = useSelector(state => isSubscribedToBook(state, symbol))

  const { t } = useTranslation()

  // resubscribe book channel on market change
  useEffect(() => {
    if (isWSConnected && symbol && !isSubscribedToSymbol) {
      dispatch(WSSubscribeChannel({
        ...SUBSCRIPTION_CONFIG,
        prec: 'P0',
        symbol,
      }))
    }
  }, [isWSConnected, symbol, isSubscribedToSymbol, dispatch])

  const unSubscribeWSChannel = (s) => {
    const booksUsingSymbol = _filter(allMarketBooks, (bookState) => bookState?.currentMarket?.wsID === s)

    // do not unsubscribe if more more than one books are subscribed to the symbol
    if (_size(booksUsingSymbol) > 1) {
      return
    }

    dispatch(WSUnsubscribeChannel({
      ...SUBSCRIPTION_CONFIG,
      prec: 'P0',
      symbol: s,
    }))
  }

  const onToggleSettings = () => {
    setSettingsOpen(state => !state)
  }

  const saveState = (param, value) => {
    updateState(layoutID, layoutI, {
      [param]: value,
    })
  }

  const onChangeSumAmounts = (value) => {
    saveState('sumAmounts', value)
  }

  const onChangeStackedView = (value) => {
    saveState('stackedView', value)
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
      key='market-dropdown'
      disabled={!canChangeMarket}
      onChange={onChangeMarket}
      value={currentMarket}
      markets={markets}
      renderWithFavorites
    />
  )

  const handleOnRemove = (...args) => {
    unSubscribeWSChannel(symbol)
    onRemove(...args)
  }

  return (
    <Panel
      label={t('orderBookModal.title')}
      dark={dark}
      darkHeader={dark}
      onRemove={handleOnRemove}
      moveable={moveable}
      removeable={removeable}
      secondaryHeaderComponents={
        showMarket && canChangeMarket && renderMarketDropdown()
      }
      headerComponents={showMarket && !canChangeMarket && <p>{isPerp ? uiID : currentPair}</p>}
      settingsOpen={settingsOpen}
      onToggleSettings={onToggleSettings}
      className='hfui-book__wrapper'
    >
      {settingsOpen ? (
        <PanelSettings
          onClose={onToggleSettings}
          content={(
            <>
              <Checkbox
                key='sum-amounts'
                label={t('orderBookModal.sumAmountsCheckbox')}
                checked={sumAmounts}
                onChange={onChangeSumAmounts}
              />
              {canChangeStacked && (
                <Checkbox
                  key='stacked-view'
                  label={t('orderBookModal.stackedViewCheckbox')}
                  checked={stackedView}
                  onChange={onChangeStackedView}
                />
              )}
            </>
          )}
        />
      ) : (
        <OrderBook
          stackedView={stackedView}
          sumAmounts={sumAmounts}
          // ufx-ui/book props start
          online={isWSConnected}
          asks={asks}
          bids={bids}
          pAsks={pAsks}
          pBids={pBids}
          tAsks={tAsks}
          tBids={tBids}
          loading={!snapshotReceived}
        // ufx-ui/book props end
        />
      )}
    </Panel>
  )
}

OrderBookPanel.propTypes = {
  onRemove: PropTypes.func.isRequired,
  showMarket: PropTypes.bool,
  canChangeStacked: PropTypes.bool,
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  savedState: PropTypes.object,
  dark: PropTypes.bool,
  activeMarket: PropTypes.shape({
    base: PropTypes.string,
    quote: PropTypes.string,
    uiID: PropTypes.string,
  }),
  markets: PropTypes.objectOf(PropTypes.object).isRequired,
  canChangeMarket: PropTypes.bool.isRequired,
  layoutID: PropTypes.string,
  layoutI: PropTypes.string.isRequired,
  updateState: PropTypes.func.isRequired,
  allMarketBooks: PropTypes.arrayOf(PropTypes.object),
  getCurrencySymbol: PropTypes.func.isRequired,
}

OrderBookPanel.defaultProps = {
  activeMarket: {
    base: '',
    quote: '',
    uiID: '',
  },
  showMarket: false,
  canChangeStacked: true,
  moveable: true,
  removeable: true,
  dark: true,
  savedState: {},
  allMarketBooks: [],
  layoutID: '',
}

export default memo(OrderBookPanel)
