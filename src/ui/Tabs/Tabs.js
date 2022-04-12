import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@ufx-ui/core'
import _map from 'lodash/map'
import Classname from 'clsx'

import './style.scss'

const Tabs = ({ tabs, onTabClick, activeTab }) => {
  return (
    <ul className='hfui-tabs'>
      {_map(tabs, ({
        label, value, Icon,
      }) => (
        <Button
          outline={activeTab !== value}
          intent='primary'
          onClick={() => onTabClick(value)}
          className={Classname('hfui-tabs__button', { transparent: activeTab !== value })}
          small
          key={label}
        >
          {Icon && <span className='icon'>{Icon}</span>}
          <span>{label}</span>
        </Button>
      ))}
    </ul>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    Icon: PropTypes.node,
    value: PropTypes.string.isRequired,
  })).isRequired,
  onTabClick: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
}

export default Tabs
