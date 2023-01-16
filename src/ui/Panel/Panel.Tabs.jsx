import React, { memo } from 'react'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import { getTabTitle } from './Panel.helpers'

const Tabs = ({ tabs, setSelectedTab, selectedTab }) => {
  return (
    <ul className='hfui-panel__header-tabs'>
      {_map(tabs, (tab, index) => {
        const { htmlKey, tabtitle, count } = tab.props
        return (
          <li
            key={htmlKey || tabtitle}
            className={ClassNames({
              active: getTabTitle(tab) === getTabTitle(tabs[selectedTab]),
            })}
            onClick={() => setSelectedTab(index)}
          >
            <p className='hfui-panel__label'>
              {tabtitle}
              {!!count && count > 0 && (
                <span className='hfui-panel__counter'>{count}</span>
              )}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

Tabs.propTypes = {
  setSelectedTab: PropTypes.func.isRequired,
  selectedTab: PropTypes.number.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.node).isRequired,
}

export default memo(Tabs)
