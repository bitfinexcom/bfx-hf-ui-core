import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox, Button, Intent } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import UIActions from '../../redux/actions/ui'
import { getIsPaperTrading } from '../../redux/selectors/ui'
import useToggle from '../../hooks/useToggle'

// eslint-disable-next-line react/prop-types
const TradingMode = ({ onClose }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const isPaperTradingMode = useSelector(getIsPaperTrading)
  const [isPaperTrading, togglePaperTrading] = useToggle(isPaperTradingMode)

  const isChanged = isPaperTradingMode !== isPaperTrading

  const onSave = () => {
    // open change trading mode modal after this modal closes
    onClose(() => dispatch(UIActions.changeTradingModeModalState(true)))
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
          label={t('main.paper')}
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
