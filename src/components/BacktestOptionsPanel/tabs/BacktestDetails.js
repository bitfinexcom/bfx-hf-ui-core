import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getSymbols } from '@ufx-ui/utils'
import { getFormatTimeFn } from '../../../redux/selectors/ui'
import getBacktestDetailsFields from './BacktestDetails.fields'

const { getCurrencySymbolMemo } = reduxSelectors

const BacktestDetails = ({ backtest }) => {
  const formatTime = useSelector(getFormatTimeFn)
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)
  const [, quote] = getSymbols(backtest.symbol)
  const quoteCcy = getCurrencySymbol(quote)

  const { t } = useTranslation()

  const backtestDetails = useMemo(
    () => getBacktestDetailsFields({
      t,
      rowData: backtest,
      formatTime,
      quoteCcy,
    }),
    [backtest, t, formatTime, quoteCcy],
  )
  return (
    <>
      {_map(backtestDetails, ({ label, value }) => {
        return (
          <div className='item details-field' key={label}>
            <div className='label'>{label}</div>
            <div className='value'>{value}</div>
          </div>
        )
      })}
    </>
  )
}

BacktestDetails.propTypes = {
  backtest: PropTypes.shape({
    symbol: PropTypes.string,
    timestamp: PropTypes.number,
    start: PropTypes.number,
    end: PropTypes.number,
    timeframe: PropTypes.string,
    candleSeed: PropTypes.number,
    capitalAllocation: PropTypes.number,
    stopLossPerc: PropTypes.number,
    maxDrawdownPerc: PropTypes.number,
  }).isRequired,
}

export default BacktestDetails
