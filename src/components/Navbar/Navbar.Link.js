import React, { memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import _isFunction from 'lodash/isFunction'

import './style.css'

import { getLocation } from '../../redux/selectors/router'

const NavbarButton = ({
  route, label, external, className, onClick,
}) => {
  const { pathname } = useSelector(getLocation)
  const dispatch = useDispatch()
  const navigate = (path) => dispatch(push(path))

  if (external) {
    return (
      <a href={external} className={className} target='_blank' rel='noopener noreferrer'>
        {label}
      </a>
    )
  }

  const onButtonClick = () => {
    if (_isFunction(onClick)) {
      onClick()
      return
    }

    if (route !== pathname) {
      navigate(route)
    }
  }

  return (
    <button
      type='button'
      className={ClassNames('hfui-navbarbutton', className, { active: pathname === route })}
      onClick={onButtonClick}
    >
      {label}
    </button>
  )
}

NavbarButton.propTypes = {
  route: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string, PropTypes.array, PropTypes.element,
  ]).isRequired,
  external: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

NavbarButton.defaultProps = {
  external: '',
  route: '',
  onClick: null,
  className: null,
}

export default memo(NavbarButton)
