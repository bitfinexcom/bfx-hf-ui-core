import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@ufx-ui/core'
import PropTypes from 'prop-types'
import _find from 'lodash/find'
import _includes from 'lodash/includes'

import Panel from '../../../ui/Panel'
import AmountInput from '../../OrderForm/FieldComponents/input.amount'
import MarketSelect from '../../MarketSelect'
import TimeFrameDropdown from '../../TimeFrameDropdown'
import timeFrames from '../../../util/time_frames'
import '../style.css'

const OptionsTab = ({
  markets, isPaperTrading, timeframe, setTimeframe, symbol, setSymbol, trades, setTrades, margin, setMargin, candleSeed, setCandleSeed,
}) => {
  const { t } = useTranslation()
  const [seedError, setSeedError] = useState(null)

  const updateSeed = (v) => {
    const error = AmountInput.validateValue(v, t)
    const processed = AmountInput.processValue(v)

    setSeedError(error)
    setCandleSeed(processed)
  }

  return (
    <Panel
      moveable={false}
      removeable={false}
      className='hfui-exec_config'
      darkHeader
    >
      <div className='hfui-exec_config-item'>
        <MarketSelect
          value={symbol}
          onChange={(selection) => {
            const sel = _find(markets, m => m.wsID === selection.wsID)
            if (!_includes(sel?.contexts, 'm')) {
              setMargin(false)
            }
            setSymbol(sel)
          }}
          markets={markets}
          renderWithFavorites
        />
      </div>
      <div className='hfui-exec_config-item'>
        <TimeFrameDropdown tf={timeframe} onChange={setTimeframe} />
      </div>
      <div className='hfui-exec_config-item'>
        <AmountInput
          className='number-input'
          def={{ label: t('strategyEditor.candleSeedCount') }}
          validationError={seedError}
          value={candleSeed}
          onChange={updateSeed}
        />
      </div>
      {!isPaperTrading && _includes(symbol?.contexts, 'm') && (
        <div className='hfui-exec_config-item'>
          <Checkbox
            label={t('strategyEditor.useMarginCheckbox')}
            checked={margin}
            onChange={setMargin}
          />
        </div>
      )}
      <div className='hfui-exec_config-item'>
        <Checkbox
          label={t('strategyEditor.useTradesCheckbox')}
          checked={trades}
          onChange={setTrades}
        />
      </div>
    </Panel>
  )
}

OptionsTab.propTypes = {
  markets: PropTypes.objectOf(PropTypes.object).isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  timeframe: PropTypes.oneOf(timeFrames).isRequired,
  setTimeframe: PropTypes.func.isRequired,
  symbol: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.bool, PropTypes.number,
  ])).isRequired,
  setSymbol: PropTypes.func.isRequired,
  trades: PropTypes.bool.isRequired,
  setTrades: PropTypes.func.isRequired,
  margin: PropTypes.bool.isRequired,
  setMargin: PropTypes.func.isRequired,
  candleSeed: PropTypes.number.isRequired,
  setCandleSeed: PropTypes.func.isRequired,
}

export default memo(OptionsTab)
