import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox, Button, Intent } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import _startCase from 'lodash/startCase'

import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { getCurrentMode, getIsPaperTrading } from '../../redux/selectors/ui'
import useToggle from '../../hooks/useToggle'
import { getAuthToken } from '../../redux/selectors/ws'

// eslint-disable-next-line react/prop-types
const TradingMode = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const isPaperTradingMode = useSelector(getIsPaperTrading)
  const authToken = useSelector(getAuthToken)
  const currentMode = useSelector(getCurrentMode)
  const [isPaperTrading, togglePaperTrading] = useToggle(isPaperTradingMode)

  const isChanged = isPaperTradingMode !== isPaperTrading

  const onSave = () => {
    dispatch(UIActions.setIsChangingAppMode(true))
    dispatch(UIActions.setTradingMode(isPaperTrading))
    dispatch(WSActions.send(['algo_order.pause', authToken, currentMode]))
    // eslint-disable-next-line lodash/prefer-lodash-method
    window.location.replace('/index.html')
  }

  return (
    <div>
      <div className='appsettings-modal__title'>
        {t('appSettings.tradingModeTab')}
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={togglePaperTrading}
          label={t('appSettings.productionTradingCheckbox')}
          checked={!isPaperTrading}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          {t('appSettings.productionTradingText')}
        </div>
      </div>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={togglePaperTrading}
          label={`${t('main.sandbox')} ${_startCase(t('main.mode'))}`}
          checked={isPaperTrading}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          {t('appSettings.paperTradingText')}
          <br />
          <a
            href='https://support.bitfinex.com/hc/en-us/articles/900001525006-Paper-Trading-test-learn-and-simulate-trading-strategies-'
            target='_blank'
            rel='noopener noreferrer'
          >
            {t('appSettings.learnMore')}
          </a>
        </div>
      </div>
      <Button
        intent={Intent.PRIMARY}
        small
        onClick={onSave}
        disabled={!isChanged}
      >
        {t('ui.save')}
      </Button>
    </div>
  )
}

export default memo(TradingMode)
