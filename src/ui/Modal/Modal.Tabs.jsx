import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _find from 'lodash/find'
import _get from 'lodash/get'
import cx from 'clsx'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const cssTransitionProps = {
  timeout: 300,
  classNames: 'hfui-modal-tabs__content__transition',
}

const ModalTabs = ({ tabs, activeTab, setActiveTab }) => {
  const currentTab = useMemo(() => {
    return _find(tabs, ({ key }) => activeTab === key, null)
  }, [activeTab, tabs])
  const currentTabComponent = _get(currentTab, 'component', null)

  return (
    <div className='hfui-modal-tabs'>
      <div className='hfui-modal-tabs__menu'>
        {_map(tabs, ({ key, label }) => (
          <div
            key={key}
            className={cx('hfui-modal-tabs__menu-item', {
              'is-active': key === activeTab,
            })}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </div>
        ))}
      </div>
      <TransitionGroup
        exit={false}
        className='hfui-modal-tabs__content'
      >
        <CSSTransition
          key={currentTab.key}
          {...cssTransitionProps}
        >
          {currentTabComponent}
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

ModalTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      component: PropTypes.node.isRequired,
    }),
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
}

export default ModalTabs
