import React from 'react'
import PropTypes from 'prop-types'
import { VOLUME_UNIT, VOLUME_UNIT_PAPER } from '@ufx-ui/bfx-containers'
import { TickerList, Ticker } from '@ufx-ui/core'

import Panel from '../../ui/Panel'
import useSize from '../../hooks/useSize'
import { tickerDataMapping, rowMapping } from './ExchangeInforBar.constants'

import './style.css'
import { MAIN_MODE } from '../../redux/reducers/ui'
import CCYIcon from './CCYIcon'

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
  showCCYIconModal,
}) => {
  const [tickerRef, size] = useSize()

  const _updateFavorites = (object) => {
    const arrayWithPairs = Object.keys(object)
    const arrayWithFavorites = arrayWithPairs.filter(pair => object[pair])
    updateFavorites(authToken, arrayWithFavorites, currentMode)
  }
  const onChangeMarketHandler = ({ rowData: { id } }) => {
    const newMarket = markets.find(market => market.uiID === id)
    if (!newMarket) {
      return
    }
    onChangeMarket(newMarket, activeMarket)
  }
  const {
    low,
    high,
    lastPrice,
    change,
    changePerc,
    volumeConverted,
  } = activeMarketTicker
  const {
    baseCCYid,
    base,
    quote,
    uiID,
    isPerp,
  } = activeMarket

  return (
    <Panel
      key='ticker-symbols'
      label='Ticker symbols'
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
              perpUI: isPerp ? uiID : null,
            }}
            dataMapping={tickerDataMapping}
            className='hfui-exchangeinfobar__ticker'
            volumeUnit={tickersVolumeUnit !== 'SELF' ? tickersVolumeUnit : quote}
            ccyIcon={<CCYIcon ccy={base} />}
            showCoinInfoIcon={Boolean(baseCCYid)}
            onShowInfoClick={showCCYIconModal}
          />
        </div>
        <div
          className='hfui-exchangeinfobar__tickerlist-wrapper'
          style={size.height ? { height: `calc(100% - ${size.height}px)` } : undefined}
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
            volumeUnitList={currentMode === MAIN_MODE ? VOLUME_UNIT : VOLUME_UNIT_PAPER}
            rowMapping={rowMapping}
            setVolumeUnit={setVolumeUnit}
            showVolumeUnit
          />
        </div>
      </div>
    </Panel>
  )
}

ExchangeInfoBar.propTypes = {
  activeMarket: PropTypes.shape({
    base: PropTypes.string,
    quote: PropTypes.string,
    uiID: PropTypes.string,
    isPerp: PropTypes.bool,
    baseCCYid: PropTypes.number,
  }).isRequired,
  onChangeMarket: PropTypes.func.isRequired,
  activeMarketTicker: PropTypes.shape({
    low: PropTypes.number,
    high: PropTypes.number,
    volume: PropTypes.number,
    lastPrice: PropTypes.number,
    change: PropTypes.number,
    changePerc: PropTypes.number,
    volumeConverted: PropTypes.number,
  }).isRequired,
  markets: PropTypes.arrayOf(PropTypes.object),
  allTickersArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  favoritePairs: PropTypes.objectOf(PropTypes.bool).isRequired,
  updateFavorites: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  currentMode: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  tickersVolumeUnit: PropTypes.string.isRequired,
  setVolumeUnit: PropTypes.func.isRequired,
  showOnlyFavoritePairs: PropTypes.bool,
  updateShowOnlyFavoritePairs: PropTypes.func.isRequired,
  showCCYIconModal: PropTypes.func.isRequired,
}

ExchangeInfoBar.defaultProps = {
  markets: [],
  onRemove: () => {},
  showOnlyFavoritePairs: false,
}

export default ExchangeInfoBar
