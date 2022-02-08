import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _find from 'lodash/find'

import Button from '../../../ui/Button'
import Dropdown from '../../../ui/Dropdown'
import { getDefaultMarket } from '../../../util/market'

const LiveForm = ({
  updateExecutionType, executionTypes, executionType, disabled, markets,
}) => {
  const [selectedMarket, setSelectedMarket] = useState(getDefaultMarket(markets))
  const executeBacktest = () => { }

  return (
    <div className='hfui-backtester__executionform'>
      <div className='hfui-backtester_row'>
        <div className='hfui-backtester__flex_start'>
          <Dropdown
            value={executionType.type}
            onChange={updateExecutionType}
            options={_map(executionTypes, et => ({
              label: et.type,
              value: et.type,
            }))}
          />
        </div>
        <div className='hfui-backtester__flex_start'>
          <Dropdown
            value={selectedMarket.uiID}
            onChange={(selection) => {
              const sel = _find(markets, m => m.uiID === selection.uiID)
              setSelectedMarket(sel)
            }}
            options={_map(markets, m => ({
              label: m.uiID,
              value: m.uiID,
            }))}
          />
        </div>
        <div className='hfui-backtester__flex_start' style={{ marginRight: -15 }}>
          <div>
            <Button
              onClick={executeBacktest}
              className='hfui-backtester__flex_start hfui-backtester__start-button'
              disabled={disabled}
              label='Start'
              green
            />
          </div>
        </div>
      </div>
    </div>
  )
}

LiveForm.propTypes = {
  updateExecutionType: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  executionTypes: PropTypes.arrayOf(PropTypes.object),
  markets: PropTypes.objectOf(PropTypes.object),
  executionType: PropTypes.string,
}

LiveForm.defaultProps = {
  markets: [{}],
  disabled: false,
  executionType: '',
  executionTypes: [],
}

export default memo(LiveForm)
