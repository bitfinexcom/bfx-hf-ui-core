import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _filter from 'lodash/filter'

import { Icon } from 'react-fa'
import useSize from '../../hooks/useSize'
import { getBrowserFullscreenProp } from '../../util/fullscreen'
import PanelSidebarTabs from './Panel.SidebarTabs'
import PanelTabs from './Panel.Tabs'
import { getForcedTab } from './Panel.helpers'
import Scrollbars from '../Scrollbars'
import PanelIconButton from './Panel.IconButton'

import './style.css'

const Panel = ({
  label,
  className,
  onRemove,
  hideIcons,
  children,
  headerComponents,
  extraIcons,
  moveable,
  removeable,
  modal,
  footer,
  settingsOpen,
  onToggleSettings,
  darkHeader,
  dark,
  showChartMarket,
  chartMarketSelect,
  secondaryHeaderComponents,
  closePanel,
  preHeaderComponents,
  dropdown,
  forcedTab,
  onTabChange,
  hasShadow,
  fullscreen,
  onEnterFullscreen,
  onExitFullscreen,
  isWideSidebar,
}) => {
  const tabs = _filter(
    React.Children.toArray(children),
    (c) => c && c.props.tabtitle,
  )
  const sbTabs = _filter(
    React.Children.toArray(children),
    (c) => c && c.props.sbtitle,
  )
  const initTab = getForcedTab(forcedTab, tabs)
  const [sidebarOpened, setSidebarOpened] = useState(true)
  const [selectedTab, setSelectedTab] = useState(initTab)
  const [selectedSBTab, setSelectedSBTab] = useState(0)
  const [panelRef, panelSize] = useSize()
  const [headerRef, headerSize] = useSize()

  const innerContent = !_isEmpty(tabs)
    ? tabs[selectedTab]
    : !_isEmpty(sbTabs)
      ? sbTabs[selectedSBTab]
      : children

  const _setSelectedTab = useCallback(
    (tab) => {
      onTabChange(tab)
      setSelectedTab(tab)
    },
    [onTabChange],
  )

  const _setSelectedSBTab = (tab) => setSelectedSBTab(tab)

  const setPanelFullscreen = () => {
    if (panelRef.current === null) return

    panelRef.current
      .requestFullscreen()
      .then(() => {
        if (document[getBrowserFullscreenProp()] !== null) {
          onEnterFullscreen()
        }
      })
      .catch((e) => {
        console.error(`[ERROR][setPanelFullscreen]: ${e}`)
      })
  }

  const exitPanelFullscreen = () => {
    if (panelRef.current === null) return

    if (
      document.fullscreenElement
      && document[getBrowserFullscreenProp()] !== null
    ) {
      onEnterFullscreen()
      document
        .exitFullscreen()
        .then(() => {
          onExitFullscreen()
        })
        .catch((e) => {
          console.error(`[ERROR][exitPanelFullscreen]: ${e}`)
        })
    }
  }

  useEffect(() => {
    if (fullscreen) {
      setPanelFullscreen()
    } else {
      exitPanelFullscreen()
    }
  }, [fullscreen, onExitFullscreen, onEnterFullscreen]) // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    document.onfullscreenchange = () => {
      if (document[getBrowserFullscreenProp()] === null) {
        onExitFullscreen()
      }
    }

    // eslint-disable-next-line no-return-assign
    return () => (document.onfullscreenchange = undefined)
  }, [onExitFullscreen])

  return (
    <div
      className={ClassNames('hfui-panel', className, {
        'dark-header': darkHeader,
        dark,
        shadow: hasShadow,
      })}
      ref={panelRef}
    >
      <div ref={headerRef}>
        <div
          className={ClassNames('hfui-panel__header', {
            'has-secondary-header': !!secondaryHeaderComponents,
          })}
        >
          <div className='hfui-panel__left-container'>
            {label && <p className='hfui-panel__label'>{label}</p>}
            {headerComponents && (
              <div className='hfui-panel__header-components'>
                {headerComponents}
              </div>
            )}
          </div>
          <div className='hfui-panel__buttons-section'>
            {preHeaderComponents && (
              <div className='hfui-panel__preheader'>{preHeaderComponents}</div>
            )}
            {closePanel && (
              <p className='hfui-panel__close' onClick={closePanel}>
                &#10005;
              </p>
            )}
          </div>
          {tabs.length > 0 && (
            <PanelTabs
              tabs={tabs}
              setSelectedTab={_setSelectedTab}
              selectedTab={selectedTab}
            />
          )}

          {!hideIcons && (
            <div className='hfui-panel__header-icons'>
              {removeable && (
                <PanelIconButton
                  onClick={onRemove}
                  icon={<i className='icon-cancel' />}
                />
              )}

              {moveable && (
                <PanelIconButton
                  onClick={() => {}}
                  icon={<i className='icon-move' />}
                />
              )}

              {showChartMarket && (
                <div className='hfui-panel__chart-market-select'>
                  {chartMarketSelect}
                </div>
              )}

              {onToggleSettings && (
                <PanelIconButton
                  onClick={onToggleSettings}
                  icon={(
                    <i
                      className={ClassNames('icon-settings-icon', {
                        yellow: settingsOpen,
                      })}
                    />
                  )}
                />
              )}

              {extraIcons}

              {dropdown}
            </div>
          )}
        </div>

        {secondaryHeaderComponents && (
          <div className='hfui-panel__secondaryheader__wrapper'>
            {secondaryHeaderComponents}
          </div>
        )}
      </div>

      <div className='hfui-panel__content'>
        {modal}
        <Scrollbars style={{ height: panelSize.height - headerSize.height }}>
          <div
            className={ClassNames('hfui-panel__content-outer', {
              'sidebar-opened': sidebarOpened,
              'no-sidebar': _isEmpty(sbTabs),
            })}
          >
            <div
              className={ClassNames('hfui_panel__sidebar-container', {
                wide: isWideSidebar,
              })}
            >
              <Icon
                className='hfui_panel__sidebar_switch'
                name={sidebarOpened ? 'chevron-left' : 'chevron-right'}
                onClick={() => setSidebarOpened(!sidebarOpened)}
              />
              {_isEmpty(tabs) && (
                <PanelSidebarTabs
                  selectedSBTab={selectedSBTab}
                  setSelectedSBTab={_setSelectedSBTab}
                  sbTabs={sbTabs}
                  sidebarOpened={sidebarOpened}
                />
              )}
            </div>
            <div className='hfui-panel__inner'>{innerContent}</div>
          </div>
        </Scrollbars>
      </div>

      {footer && <div className='hfui-panel__footer'>{footer}</div>}
    </div>
  )
}

Panel.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onRemove: PropTypes.func,
  headerComponents: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  secondaryHeaderComponents: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  hideIcons: PropTypes.bool,
  extraIcons: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  modal: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  darkHeader: PropTypes.bool,
  dark: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  settingsOpen: PropTypes.bool,
  onToggleSettings: PropTypes.func,
  showChartMarket: PropTypes.bool,
  chartMarketSelect: PropTypes.node,
  closePanel: PropTypes.func,
  preHeaderComponents: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  forcedTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onTabChange: PropTypes.func,
  dropdown: PropTypes.node,
  hasShadow: PropTypes.bool,
  fullscreen: PropTypes.bool,
  onEnterFullscreen: PropTypes.func,
  onExitFullscreen: PropTypes.func,
  isWideSidebar: PropTypes.bool,
}

Panel.defaultProps = {
  moveable: true,
  removeable: true,
  darkHeader: false,
  dark: false,
  className: '',
  label: '',
  onRemove: () => {},
  headerComponents: null,
  secondaryHeaderComponents: null,
  hideIcons: false,
  extraIcons: null,
  children: [],
  modal: null,
  footer: null,
  settingsOpen: false,
  onToggleSettings: null,
  showChartMarket: false,
  chartMarketSelect: null,
  closePanel: null,
  preHeaderComponents: null,
  forcedTab: '',
  onTabChange: () => {},
  dropdown: null,
  hasShadow: false,
  fullscreen: false,
  onEnterFullscreen: () => {},
  onExitFullscreen: () => {},
  isWideSidebar: false,
}

export default Panel
