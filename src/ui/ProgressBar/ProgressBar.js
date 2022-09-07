import React from 'react'
import PropTypes from 'prop-types'
import ReactProgressBar from '@ramonak/react-progress-bar'
import { useSelector } from 'react-redux'
import { getThemeSetting, THEMES } from '../../redux/selectors/ui'
import scssVariables from '../../variables.scss'

const ProgressBar = ({ progress, ...props }) => {
  const theme = useSelector(getThemeSetting)
  const isDark = theme === THEMES.DARK

  const {
    backgroundColor,
    greyColor,
    lighterBackgroundColor,
    darkerBackgroundColorLight,
  } = scssVariables

  const bgColor = isDark ? backgroundColor : greyColor
  const baseBgColor = isDark
    ? lighterBackgroundColor
    : darkerBackgroundColorLight

  return (
    <ReactProgressBar
      animateOnRender
      completed={progress}
      bgColor={bgColor}
      baseBgColor={baseBgColor}
      labelAlignment={progress < 30 ? 'left' : 'right'}
      {...props}
    />
  )
}

ProgressBar.propTypes = {
  progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}

export default ProgressBar
