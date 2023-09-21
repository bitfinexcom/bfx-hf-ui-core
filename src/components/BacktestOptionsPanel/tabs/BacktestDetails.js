import React, { useMemo } from 'react'
import _map from 'lodash/map'
import _delay from 'lodash/delay'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getSymbols } from '@ufx-ui/utils'
import { Button, Intent } from '@ufx-ui/core'
import { getFormatTimeFn } from '../../../redux/selectors/ui'
import getBacktestDetailsFields from './BacktestDetails.fields'
import UIActions from '../../../redux/actions/ui'
import WSActions from '../../../redux/actions/ws'
import { getCurrentHistoryBacktest } from '../../../redux/selectors/ws'
import { BACKTEST_TAB_SECTIONS } from '../../../redux/reducers/ui'
import Scrollbars from '../../../ui/Scrollbars'

const { getCurrencySymbolMemo } = reduxSelectors

const BacktestDetails = () => {
  const formatTime = useSelector(getFormatTimeFn)
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)
  const backtest = useSelector(getCurrentHistoryBacktest)

  const [, quote] = getSymbols(backtest.symbol)
  const quoteCcy = getCurrencySymbol(quote)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const setActiveSection = (section) => dispatch(UIActions.setBacktestActiveSection(section))
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
    dispatch(WSActions.recvBacktestResults({ ...backtest.btResult }, false))
    _delay(setActiveSection, 500, BACKTEST_TAB_SECTIONS.HISTORY_BT_RESULTS)
  }

  return (
    <>
      <Scrollbars className='details-container'>
        {_map(backtestDetails, ({ label, value }) => {
          return (
            <div className='details-field' key={label}>
              <div className='label'>{label}</div>
              <div className='value'>{value}</div>
            </div>
          )
        })}
      </Scrollbars>

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

export default BacktestDetails
