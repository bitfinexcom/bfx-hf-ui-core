import React, { useMemo, memo } from 'react'
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
  }, [t])

  return (
    <Dropdown
      key='tf-dropdown'
      placeholder='Select a time frame'
      onChange={onChange}
      value={tf}
      options={options}
    />
  )
}

TimeFrameDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  tf: PropTypes.string.isRequired,
}

export default memo(TimeFrameDropdown)
