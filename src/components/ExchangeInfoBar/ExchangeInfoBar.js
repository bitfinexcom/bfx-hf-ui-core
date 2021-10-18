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
import { getTickerDataMapping, rowMapping } from './ExchangeInforBar.constants'
import { MAIN_MODE } from '../../redux/reducers/ui'
import CCYIcon from './CCYIcon'

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
}) => {
  const [tickerRef, size] = useSize()

  const _updateFavorites = (object) => {
    const arrayWithFavorites = _filter(_keys(object), pair => object[pair])
    updateFavorites(authToken, arrayWithFavorites, currentMode)
  }
  const onChangeMarketHandler = ({ rowData } = {}) => {
    const newMarket = _find(markets, market => market.uiID === rowData?.uiID)
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
    base,
    quote,
    uiID,
    isPerp,
  } = activeMarket
  const { t } = useTranslation()

  const tickerMapping = useMemo(() => getTickerDataMapping(getCurrencySymbol), [getCurrencySymbol])

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
              perpUI: isPerp ? uiID : null,
            }}
            dataMapping={tickerMapping}
            className='hfui-exchangeinfobar__ticker'
            volumeUnit={tickersVolumeUnit !== 'SELF' ? tickersVolumeUnit : base}
            ccyIcon={<CCYIcon ccy={base} />}
            showCoinInfoIcon={isCcyArticleAvailbale}
            onShowInfoClick={showCcyIconModal}
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
  markets: PropTypes.objectOf(PropTypes.object),
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
  showCcyIconModal: PropTypes.func.isRequired,
  isCcyArticleAvailbale: PropTypes.bool,
  getCurrencySymbol: PropTypes.func.isRequired,
}

ExchangeInfoBar.defaultProps = {
  markets: [],
  onRemove: () => { },
  showOnlyFavoritePairs: false,
  isCcyArticleAvailbale: false,
}

export default ExchangeInfoBar
