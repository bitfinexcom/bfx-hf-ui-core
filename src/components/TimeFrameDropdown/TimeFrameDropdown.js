import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import { useTranslation } from 'react-i18next'

import Dropdown from '../../ui/Dropdown'
import timeFrames from '../../util/time_frames'

const TimeFrameDropdown = ({ tf, onChange }) => {
  const { t } = useTranslation()
  const options = useMemo(() => {
    return _map(timeFrames, (time) => ({
      value: time,
      label: t(`time.${time}`),
    }))
  }, [])

  return (
    <div className='hfui-backtester__executionform'>
      <div className='hfui-backtester__executiondropdown input-label'>
        <Dropdown
          key='tf-dropdown'
          placeholder='Select a time frame'
          onChange={onChange}
          value={tf}
          options={options}
        />
      </div>
    </div>
  )
}

TimeFrameDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  tf: PropTypes.string.isRequired,
}

export default TimeFrameDropdown
