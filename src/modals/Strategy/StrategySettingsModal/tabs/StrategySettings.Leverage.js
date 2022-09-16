/* eslint-disable jsx-a11y/anchor-has-content */

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from '@ufx-ui/core'
import _map from 'lodash/map'
import { Trans, useTranslation } from 'react-i18next'
import AttentionBar from '../../../../ui/AttentionBar/AttentionBar'
import Dropdown from '../../../../ui/Dropdown'
import { MARGIN_TRADE_MODES } from '../StrategySettingsModal.constants'
import { MARGIN_TRADING_ARTICLE_URL } from '../../../../redux/config'
import SliderInput from '../../../../components/OrderForm/FieldComponents/input.range'

const LeverageTab = ({
  tradeOnMargin,
  setTradeOnMargin,
  setMarginTradeMode,
  marginTradeMode,
  leverageValue,
  setLeverageValue,
  increaseLeverage,
  setIncreaseLeverage,
  isPairSelected,
}) => {
  const { t } = useTranslation()

  const marginTradeModesOptions = useMemo(
    () => _map(MARGIN_TRADE_MODES, (mode) => ({
      label: t(`strategySettingsModal.${mode}`),
      value: mode,
    })),
    [t],
  )

  return (
    <div className='hfui-execution-options-modal'>
      {!isPairSelected && (
        <AttentionBar className='hfui-execution-options-modal__option' red>
          {t('strategySettingsModal.noSelectedPairWarning')}
        </AttentionBar>
      )}
      <div className='hfui-execution-options-modal__option'>
        <Checkbox
          onChange={setTradeOnMargin}
          label={t('strategySettingsModal.tradeOnMarginCheckbox')}
          checked={tradeOnMargin}
          disabled={!isPairSelected}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          <p>{t('strategySettingsModal.tradeOnMarginCheckboxDescription')}</p>
        </div>
      </div>
      {tradeOnMargin && (
        <>
          <div className='hfui-execution-options-modal__option hfui-execution-options-modal__dropdown-choose'>
            <p>{t('strategySettingsModal.chooseDropdown')}</p>
            <Dropdown
              options={marginTradeModesOptions}
              onChange={setMarginTradeMode}
              value={marginTradeMode}
              disabled={!isPairSelected}
            />
          </div>
          {marginTradeMode === MARGIN_TRADE_MODES.MAX && (
            <div className='hfui-execution-options-modal__option'>
              <p>{t('strategySettingsModal.maxModeDescription')}</p>
            </div>
          )}
          {marginTradeMode === MARGIN_TRADE_MODES.FIXED && (
            <>
              <div className='hfui-execution-options-modal__option'>
                <p>{t('strategySettingsModal.fixModeDescription')}</p>
              </div>
              <SliderInput
                def={{
                  label: t('orderForm.leverage'),
                  min: 0,
                  max: 100,
                }}
                value={leverageValue}
                onChange={setLeverageValue}
                className='hfui-execution-options-modal__option'
                disabled={!isPairSelected}
              />
              <div className='hfui-execution-options-modal__option'>
                <Checkbox
                  onChange={setIncreaseLeverage}
                  label={t('strategySettingsModal.increaseLeverageCheckbox')}
                  checked={increaseLeverage}
                  disabled={!isPairSelected}
                  className='appsettings-modal__checkbox'
                />
                <div className='appsettings-modal__description'>
                  <p>
                    {t(
                      'strategySettingsModal.increaseLeverageCheckboxDescription',
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )}
      <AttentionBar green>
        <Trans
          t={t}
          i18nKey='strategySettingsModal.leverageInfo'
          components={{
            url: (
              <a
                href={MARGIN_TRADING_ARTICLE_URL}
                target='_blank'
                rel='noopener noreferrer'
              />
            ),
          }}
        />
      </AttentionBar>
    </div>
  )
}

LeverageTab.propTypes = {
  tradeOnMargin: PropTypes.bool.isRequired,
  setTradeOnMargin: PropTypes.func.isRequired,
  setMarginTradeMode: PropTypes.func.isRequired,
  marginTradeMode: PropTypes.string.isRequired,
  leverageValue: PropTypes.number.isRequired,
  setLeverageValue: PropTypes.func.isRequired,
  increaseLeverage: PropTypes.bool.isRequired,
  setIncreaseLeverage: PropTypes.func.isRequired,
  isPairSelected: PropTypes.bool.isRequired,
}

export default LeverageTab
