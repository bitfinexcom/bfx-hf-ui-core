import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _isEmpty from 'lodash/isEmpty'
import { push } from 'connected-react-router'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router'
import { getBacktestResults, getExecutionResults } from '../../redux/selectors/ws'
import { strategyEditor } from '../../constants/routes'
import Indicator from '../../ui/Indicator'

import './style.css'

const NavbarButton = ({
  route, label, external,
}) => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const navigate = (path) => dispatch(push(path))
  const { executing, loading, results } = useSelector(getExecutionResults)
  const { loading: btLoading, finished } = useSelector(getBacktestResults)

  const getIndicator = () => {
    if (route !== strategyEditor.path || pathname === strategyEditor.path) {
      return null
    }
    if (loading || btLoading) {
      return <Indicator white blinking />
    }
    if (!_isEmpty(executing)) {
      return <Indicator red blinking />
    }
    if (finished || !_isEmpty(results)) {
      return <Indicator green />
    }
    return null
  }

  if (external) {
    return (
      <a href={external} target='_blank' rel='noopener noreferrer'>
        {label}
      </a>
    )
  }

  return (
    <button
      type='button'
      className={ClassNames('hfui-navbarbutton', { active: pathname === route })}
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
    PropTypes.string, PropTypes.array, PropTypes.element,
  ]).isRequired,
  external: PropTypes.string,
}

NavbarButton.defaultProps = {
  external: '',
  route: '',
}

export default memo(NavbarButton)
