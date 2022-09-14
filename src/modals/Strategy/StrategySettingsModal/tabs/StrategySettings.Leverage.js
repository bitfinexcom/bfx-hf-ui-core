import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import AttentionBar from '../../../../ui/AttentionBar/AttentionBar'

const LeverageTab = ({ tradeOnMargin, setTradeOnMargin }) => {
  const { t } = useTranslation()

  return (
    <div className='hfui-execution-options-modal'>
      <AttentionBar red>
        {t('executionOptionsModal.noSelectedPairWarning')}
      </AttentionBar>
      <div className='appsettings-modal__setting'>
        <Checkbox
          onChange={setTradeOnMargin}
          label={t('executionOptionsModal.tradeOnMarginCheckbox')}
          checked={tradeOnMargin}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          <p>{t('executionOptionsModal.tradeOnMarginCheckboxDescription')}</p>
        </div>
      </div>
    </div>
  )
}

export default LeverageTab
