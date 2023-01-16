import React, { memo } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _isFunction from 'lodash/isFunction'
import ClassNames from 'clsx'
import { getTabTitle } from './Panel.helpers'

const SidebarTabs = ({
  sidebarOpened,
  sbTabs,
  selectedSBTab,
  setSelectedSBTab,
}) => {
  return (
    <ul className='hfui_panel__sidebar'>
      {_map(sbTabs, (tab, index) => {
        const {
          htmlKey, sbtitle, onClick,
        } = tab.props
        return (
          <li
            key={htmlKey || sbtitle}
            className={ClassNames({
              active: getTabTitle(tab) === getTabTitle(sbTabs[selectedSBTab]),
            })}
            onClick={() => {
              if (_isFunction(onClick)) {
                onClick()
                return
              }
              setSelectedSBTab(index)
            }}
          >
            {sbtitle({ selectedTab: selectedSBTab, sidebarOpened })}
          </li>
        )
      })}
    </ul>
  )
}

SidebarTabs.propTypes = {
  sidebarOpened: PropTypes.bool.isRequired,
  sbTabs: PropTypes.arrayOf(PropTypes.node).isRequired,
  selectedSBTab: PropTypes.number.isRequired,
  setSelectedSBTab: PropTypes.func.isRequired,
}

export default memo(SidebarTabs)
