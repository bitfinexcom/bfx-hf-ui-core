import React, { useCallback } from 'react'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Tooltip } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import MarketSelect from '../MarketSelect'
import {
  STRATEGY_OPTIONS_KEYS,
  processMarketChangeInStrategy,
} from '../StrategyEditor/StrategyEditor.helpers'
import {
  MARKET_SHAPE,
  STRATEGY_SHAPE,
} from '../../constants/prop-types-shapes'

const StrategyMarketSelect = ({
  symbol,
  saveStrategyOptions,
  markets,
  isDisabled,
}) => {
  const onMarketSelectChange = useCallback(
    (selection) => {
      if (isDisabled) {
        return
      }
      const updatedStrategy = processMarketChangeInStrategy(selection, markets)
      saveStrategyOptions(updatedStrategy)
    },
    [isDisabled, markets, saveStrategyOptions],
  )

  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-options__dropdown-wrapper item'>
      <div className='hfui-strategy-options__input'>
        <MarketSelect
          value={symbol}
          onChange={onMarketSelectChange}
          markets={markets}
          placeholder={t('strategyEditor.selectMarketPlaceholder')}
          renderWithFavorites
          disabled={isDisabled}
        />
        {isDisabled ? (
          <p className='hfui-orderform__input-label hfui-strategy-options__description'>
            {t('strategyEditor.selectMarketDescriptionDisabled')}
          </p>
        ) : (
          <p
            className={clsx(
              'hfui-orderform__input-label hfui-strategy-options__description',
              {
                error: _isEmpty(symbol),
              },
            )}
          >
            <b>{t('ui.required')}</b>
          </p>
        )}
      </div>
      <Tooltip
        className='__react-tooltip __react-tooltip-break-line'
        content={(
          <span>
            <b>{t('ui.required')}</b>
            .&nbsp;
            {t('strategyEditor.selectMarketDescription')}
          </span>
        )}
      >
        <i className='fa fa-info-circle __react_component_tooltip' />
      </Tooltip>
    </div>
  )
}

StrategyMarketSelect.propTypes = {
  markets: PropTypes.arrayOf(PropTypes.shape(MARKET_SHAPE)).isRequired,
  symbol: PropTypes.shape(
    STRATEGY_SHAPE.strategyOptions[STRATEGY_OPTIONS_KEYS.SYMBOL],
  ),
  saveStrategyOptions: PropTypes.func,
  isDisabled: PropTypes.bool,
}

StrategyMarketSelect.defaultProps = {
  symbol: null,
  isDisabled: false,
  saveStrategyOptions: () => {},
}

export default StrategyMarketSelect
