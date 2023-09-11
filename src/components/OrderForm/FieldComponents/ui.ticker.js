import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useSelector } from 'react-redux'
import { getMarketBySymbol, getTicker } from '../../../redux/selectors/meta'
import { getActiveMarket } from '../../../redux/selectors/ui'
import PLNumber from '../../../ui/PLNumber'
import { processBalance } from '../../../util/ui'

const preparePrice = (value) => processBalance(value, false)

const TickerBar = (props) => {
  const {
    onFieldChange, layout: { fields }, fieldData: { symbol },
  } = props
  const currentOrderMarket = useSelector(getMarketBySymbol)(symbol)
  const activeMarket = useSelector(getActiveMarket)

  // Use active market if the order doesn't have its own
  const market = _isEmpty(currentOrderMarket)
    ? activeMarket
    : currentOrderMarket

  const marketTicker = useSelector((state) => getTicker(state, market))

  const { t } = useTranslation()

  const { bid, ask } = marketTicker
  const { quote } = market

  const fieldToChange = Object.prototype.hasOwnProperty.call(fields, 'price') ? 'price' : 'distance'

  const setInputPrice = (value) => onFieldChange(fieldToChange, value)

  return (
    <div className='hfui-orderform__ticker-container'>
      <div
        className='ticker-section'
        onClick={() => setInputPrice(bid)}
        role='button'
        tabIndex='0'
      >
        <span className='ticker-name'>
          {t('orderForm.bid')}
          :
        </span>
        <PLNumber
          value={bid}
          prepareFunc={preparePrice}
          ccy={quote}
          isGreen
        />
      </div>
      <div
        className='ticker-section'
        onClick={() => setInputPrice(ask)}
        role='button'
        tabIndex='0'
      >
        <span className='ticker-name'>
          {t('orderForm.ask')}
          :
        </span>
        <PLNumber value={ask} prepareFunc={preparePrice} ccy={quote} />
      </div>
    </div>
  )
}

TickerBar.propTypes = {
  onFieldChange: PropTypes.func.isRequired,
  layout: PropTypes.shape({
    fields: PropTypes.shape({
      ticker: PropTypes.objectOf(PropTypes.string),
    }),
  }).isRequired,
  fieldData: PropTypes.shape({
    symbol: PropTypes.string,
  }).isRequired,
}

export default memo(TickerBar)
