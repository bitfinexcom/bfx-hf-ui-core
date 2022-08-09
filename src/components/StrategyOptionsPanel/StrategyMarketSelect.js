import React from 'react'
import _isEmpty from 'lodash/isEmpty'
import _includes from 'lodash/includes'
import _find from 'lodash/find'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Tooltip } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import MarketSelect from '../MarketSelect'
import { STRATEGY_OPTIONS_KEYS } from '../StrategyEditor/StrategyEditor.helpers'
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
  const onMarketSelectChange = (selection) => {
    if (isDisabled) {
      return
    }
    const sel = _find(markets, (m) => m.wsID === selection.wsID)
    const options = {
      [STRATEGY_OPTIONS_KEYS.SYMBOL]: sel,
    }

    if (!_includes(sel?.contexts, 'm')) {
      options[STRATEGY_OPTIONS_KEYS.MARGIN] = false
    }
    saveStrategyOptions(options)
  }

  const { t } = useTranslation()

  return (
    <>
      <div className='hfui-strategy-options__input hfui-strategy-options__input--unlimited item'>
        <MarketSelect
          value={symbol}
          onChange={onMarketSelectChange}
          markets={markets}
          placeholder={t('strategyEditor.selectMarketPlaceholder')}
          renderWithFavorites
          disabled={isDisabled}
        />
        {isDisabled ? (
          <p className='hfui-orderform__input-label'>
            {t('strategyEditor.selectMarketDescriptionDisabled')}
          </p>
        ) : (
          <p
            className={clsx('hfui-orderform__input-label', {
              error: _isEmpty(symbol),
            })}
          >
            <span>
              <b>{t('ui.required')}</b>
              .&nbsp;
              {t('strategyEditor.selectMarketDescription')}
            </span>
          </p>
        )}
      </div>
      <Tooltip
        className='__react-tooltip __react-tooltip-break-line'
        content={t('strategyEditor.capitalAllocationHelp')}
      >
        <i className='fa fa-info-circle __react_component_tooltip title-tooltip' />
      </Tooltip>
    </>
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
