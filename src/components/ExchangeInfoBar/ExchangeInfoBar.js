import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { VOLUME_UNIT, VOLUME_UNIT_PAPER } from '@ufx-ui/bfx-containers'
import { TickerList, Ticker } from '@ufx-ui/core'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _keys from 'lodash/keys'

import { useTranslation } from 'react-i18next'
import Panel from '../../ui/Panel'
import useSize from '../../hooks/useSize'
import {
  getTickerDataMapping,
  getTickerListMapping,
} from './ExchangeInforBar.constants'
import { getCorrectIconNameOfPerpCcy } from '../../util/market'
import { MAIN_MODE } from '../../redux/reducers/ui'
import CCYIcon from '../../ui/CCYIcon'
import { MARKET_SHAPE, TICKER_SHAPE } from '../../constants/prop-types-shapes'

import './style.css'

const ExchangeInfoBar = ({
  onChangeMarket,
  activeMarket,
  activeMarketTicker,
  markets,
  allTickersArray,
  favoritePairs,
  updateFavorites,
  authToken,
  currentMode,
  onRemove,
  tickersVolumeUnit,
  setVolumeUnit,
  showOnlyFavoritePairs,
  updateShowOnlyFavoritePairs,
  showCcyIconModal,
  isCcyArticleAvailbale,
  getCurrencySymbol,
  savedState,
  updateState,
}) => {
  const [tickerRef, size] = useSize()

  const _updateFavorites = (object) => {
    const arrayWithFavorites = _filter(_keys(object), (pair) => object[pair])
    updateFavorites(authToken, arrayWithFavorites, currentMode)
  }
  const onChangeMarketHandler = ({ rowData } = {}) => {
    const newMarket = _find(markets, (market) => market.wsID === rowData?.id)
    if (!newMarket) {
      return
    }
    onChangeMarket(newMarket, activeMarket)
  }

  const {
    low, high, lastPrice, change, changePerc, volumeConverted,
  } = activeMarketTicker

  const {
    base, quote, uiID, isPerp,
  } = activeMarket

  const { t } = useTranslation()

  const tickerMapping = useMemo(
    () => getTickerDataMapping(getCurrencySymbol),
    [getCurrencySymbol],
  )
  const tickerListMapping = useMemo(
    () => getTickerListMapping(getCurrencySymbol, markets),
    [getCurrencySymbol, markets],
  )

  return (
    <Panel
      key='ticker-symbols'
      label={t('tickersPanel.title')}
      className='hfui-panel--tickerlist'
      onRemove={onRemove}
      darkHeader
      dark
      moveable
      removeable
    >
      <div className='hfui-exchangeinfobar__wrapper'>
        <div ref={tickerRef} className='hfui-exchangeinfobar__ticker-wrapper'>
          <Ticker
            data={{
              baseCcy: base,
              quoteCcy: quote,
              lastPrice,
              change,
              changePerc,
              volume: volumeConverted,
              low,
              high,
              isPerp,
              uiID,
            }}
            dataMapping={tickerMapping}
            className='hfui-exchangeinfobar__ticker'
            volumeUnit={tickersVolumeUnit !== 'SELF' ? tickersVolumeUnit : base}
            ccyIcon={(
              <CCYIcon
                className='hfui-exchangeinfobar__ccy-icon'
                ccy={isPerp ? getCorrectIconNameOfPerpCcy(base) : base}
              />
            )}
            showCoinInfoIcon={isCcyArticleAvailbale}
            onShowInfoClick={showCcyIconModal}
          />
        </div>
        <div
          className='hfui-exchangeinfobar__tickerlist-wrapper'
          style={
            size.height
              ? { height: `calc(100% - ${size.height}px)` }
              : undefined
          }
        >
          <TickerList
            data={allTickersArray}
            favs={favoritePairs}
            saveFavs={_updateFavorites}
            showOnlyFavs={showOnlyFavoritePairs}
            setShowOnlyFavs={updateShowOnlyFavoritePairs}
            onRowClick={onChangeMarketHandler}
            className='hfui-exchangeinfobar__tickerlist'
            volumeUnit={tickersVolumeUnit}
            volumeUnitList={
              currentMode === MAIN_MODE ? VOLUME_UNIT : VOLUME_UNIT_PAPER
            }
            rowMapping={tickerListMapping}
            setVolumeUnit={setVolumeUnit}
            tableState={savedState}
            updateTableState={updateState}
            showVolumeUnit
          />
        </div>
      </div>
    </Panel>
  )
}

ExchangeInfoBar.propTypes = {
  activeMarket: PropTypes.shape(MARKET_SHAPE).isRequired,
  onChangeMarket: PropTypes.func.isRequired,
  activeMarketTicker: PropTypes.shape(TICKER_SHAPE).isRequired,
  markets: PropTypes.objectOf(PropTypes.shape(MARKET_SHAPE)),
  allTickersArray: PropTypes.arrayOf(PropTypes.shape(TICKER_SHAPE)).isRequired,
  favoritePairs: PropTypes.objectOf(PropTypes.bool).isRequired,
  updateFavorites: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  currentMode: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  tickersVolumeUnit: PropTypes.string.isRequired,
  setVolumeUnit: PropTypes.func.isRequired,
  showOnlyFavoritePairs: PropTypes.bool,
  updateShowOnlyFavoritePairs: PropTypes.func.isRequired,
  showCcyIconModal: PropTypes.func.isRequired,
  isCcyArticleAvailbale: PropTypes.bool,
  getCurrencySymbol: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  savedState: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
}

ExchangeInfoBar.defaultProps = {
  markets: {},
  onRemove: () => {},
  showOnlyFavoritePairs: false,
  isCcyArticleAvailbale: false,
}

export default ExchangeInfoBar
