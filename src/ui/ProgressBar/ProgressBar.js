import React from 'react'
import PropTypes from 'prop-types'
import { Line } from 'rc-progress'
import { useSelector } from 'react-redux'
import { getThemeSetting, THEMES } from '../../redux/selectors/ui'
import scssVariables from '../../variables.scss'

import './style.css'

const ProgressBar = ({ percent, showPercent }) => {
  const theme = useSelector(getThemeSetting)
  const isDark = theme === THEMES.DARK

  const {
    backgroundColor,
    greyColor,
    backgroundColorLight,
    darkerBackgroundColorLight,
  } = scssVariables

  const strokeColor = isDark ? backgroundColor : greyColor
  const trailColor = isDark
    ? backgroundColorLight
    : darkerBackgroundColorLight

  return (
    <div className='hfui-progress-bar'>
      <Line
        className='hfui-progress-bar__line'
        percent={percent}
        strokeColor={strokeColor}
        trailColor={trailColor}
      />
      {showPercent && (
        <p className='hfui-progress-bar__percent'>{`${percent} %`}</p>
      )}
    </div>
  )
}

ProgressBar.propTypes = {
  percent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  showPercent: PropTypes.bool,
}

ProgressBar.defaultProps = {
  showPercent: false,
}

export default ProgressBar
