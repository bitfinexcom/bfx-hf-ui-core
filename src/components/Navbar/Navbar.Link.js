import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _isEmpty from 'lodash/isEmpty'
import { push } from 'connected-react-router'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router'
import {
  getBacktestResults,
  getCurrentStrategyExecutionState,
  getExecutionConnectionState,
} from '../../redux/selectors/ws'
import { strategyEditor } from '../../constants/routes'
import Indicator from '../../ui/Indicator'

import './style.css'

const NavbarButton = ({
  route, label, external, className,
}) => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const navigate = (path) => dispatch(push(path))
  const { executing, loading, results } = useSelector(
    getCurrentStrategyExecutionState,
  )
  const { isExecutionConnected } = useSelector(getExecutionConnectionState)

  const { loading: btLoading, finished } = useSelector(getBacktestResults)

  const getIndicator = () => {
    if (route !== strategyEditor.path || pathname === strategyEditor.path) {
      return null
    }
    if (loading || btLoading) {
      return <Indicator white blinking />
    }
    if (!isExecutionConnected) {
      return <Indicator grey />
    }
    if (executing) {
      return <Indicator red blinking />
    }
    if (finished || !_isEmpty(results)) {
      return <Indicator green />
    }
    return null
  }

  if (external) {
    return (
      <a
        href={external}
        className={className}
        target='_blank'
        rel='noopener noreferrer'
      >
        {label}
      </a>
    )
  }

  return (
    <button
      type='button'
      className={ClassNames('hfui-navbarbutton', className, {
        active: pathname === route,
      })}
      onClick={route === pathname ? undefined : () => navigate(route)}
    >
      {label}
      {getIndicator()}
    </button>
  )
}

NavbarButton.propTypes = {
  route: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.element,
  ]).isRequired,
  external: PropTypes.string,
  className: PropTypes.string,
}

NavbarButton.defaultProps = {
  external: '',
  route: '',
  className: null,
}

export default memo(NavbarButton)
