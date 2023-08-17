import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _delay from 'lodash/delay'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getSymbols } from '@ufx-ui/utils'
import { Button, Intent } from '@ufx-ui/core'
import { getFormatTimeFn } from '../../../redux/selectors/ui'
import getBacktestDetailsFields from './BacktestDetails.fields'
import WSActions from '../../../redux/actions/ws'
import { BACKTEST_TAB_SECTIONS } from '../../StrategyEditor/tabs/BacktestTab'
import { getBacktestById } from '../../../redux/selectors/ws'

const { getCurrencySymbolMemo } = reduxSelectors

const BacktestDetails = ({ btHistoryId, setActiveSection }) => {
  const formatTime = useSelector(getFormatTimeFn)
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)
  const backtest = useSelector(getBacktestById(btHistoryId))

  const [, quote] = getSymbols(backtest.symbol)
  const quoteCcy = getCurrencySymbol(quote)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const backtestDetails = useMemo(
    () => getBacktestDetailsFields({
      t,
      rowData: backtest,
      formatTime,
      quoteCcy,
    }),
    [backtest, t, formatTime, quoteCcy],
  )

  const onButtonClick = () => {
    dispatch(
      WSActions.recvBacktestResults({
        ...backtest.btResult,
        timestamp: backtest.timestamp,
      }),
    )
    _delay(setActiveSection, 500, BACKTEST_TAB_SECTIONS.HISTORY_BT_RESULTS)
  }

  return (
    <>
      {_map(backtestDetails, ({ label, value }) => {
        return (
          <div className='details-field' key={label}>
            <div className='label'>{label}</div>
            <div className='value'>{value}</div>
          </div>
        )
      })}
      <div className='button-container'>
        <Button
          className='hfui-strategy-backtest-options__start-btn'
          onClick={onButtonClick}
          intent={Intent.PRIMARY}
        >
          {t('table.moreInfo')}
        </Button>
      </div>
    </>
  )
}

BacktestDetails.propTypes = {
  btHistoryId: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
}

export default BacktestDetails
