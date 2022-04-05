import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { getTicker } from '../../../redux/selectors/meta'
import { getActiveMarket } from '../../../redux/selectors/ui'
import PLNumber from '../../../ui/PLNumber'
import { processBalance } from '../../../util/ui'

const preparePrice = (value) => processBalance(value, false)

const TickerBar = (props) => {
  const { onFieldChange, layout: { fields } } = props
  const activeMarket = useSelector(getActiveMarket)
  const activeMarketTicker = useSelector((state) => getTicker(state, activeMarket))
  const { t } = useTranslation()

  const { bid, ask } = activeMarketTicker
  const { quote } = activeMarket

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
    fields: PropTypes.objectOf(PropTypes.object),
  }).isRequired,
}

export default memo(TickerBar)
