import React, {
  memo, useCallback, useEffect, useState,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _last from 'lodash/last'
import _find from 'lodash/find'
import _entries from 'lodash/entries'
import _filter from 'lodash/filter'
import { Responsive as RGL, WidthProvider } from 'react-grid-layout'
import { getLocation } from '../../redux/selectors/router'
import {
  removeComponent, changeLayout, setLayoutID, storeUnsavedLayout,
} from '../../redux/actions/ui'
import { renderLayoutElement } from './GridLayout.helpers'
import {
  GRID_BREAKPOINTS,
  GRID_COLUMNS,
  GRID_CELL_SPACINGS,
  GRID_CONTAINER_SPACINGS,
  GRID_ROW_HEIGHT,
} from './Grid.constants'

import {
  getLayouts,
  getLayoutID,
  getCurrentUnsavedLayout,
} from '../../redux/selectors/ui'

import { getLastUsedLayoutID } from '../../util/layout'
import { generateLayout } from './Grid.layouts'
import tradingTerminalLayout from './layouts/trading'
import marketDataLayout from './layouts/marketData'
import { marketData } from '../../constants/routes'

const ReactGridLayout = WidthProvider(RGL)

const getLayoutConfig = pathname => (pathname === marketData.path ? marketDataLayout : tradingTerminalLayout)

const GridLayout = ({
  sharedProps, tradesProps, bookProps, chartProps, orderFormProps,
}) => {
  const dispatch = useDispatch()
  const [breakpoint, setBreakpoint] = useState(RGL.utils.getBreakpointFromWidth(GRID_BREAKPOINTS, document.body.clientWidth))
  const [mounted, setMounted] = useState(false)

  const { pathname } = useSelector(getLocation)
  const layoutConfig = useMemo(() => getLayoutConfig(pathname), [pathname])
  const layouts = useSelector(getLayouts)
  const layoutID = useSelector(getLayoutID)
  const currentSavedLayout = _get(layouts, layoutID, {})
  const unsavedLayoutDef = useSelector(getCurrentUnsavedLayout)
  const isValidUnsavedLayout = _get(unsavedLayoutDef, 'routePath', null) === pathname
  const isValidSavedLayout = currentSavedLayout.routePath === pathname
  const layoutsForCurrRoute = _filter(_entries(layouts), ([, layout]) => layout.routePath === pathname)
  const lastUsedLayoutID = getLastUsedLayoutID(pathname)

  const [lastLayoutID, lastLayoutDef] = _find(layoutsForCurrRoute, ([id]) => id === lastUsedLayoutID) || _last(layoutsForCurrRoute
    .sort((a, b) => a[1].savedAt - b[1].savedAt)) || []

  // should use unsaved one first, then saved one (if selected) else last saved one
  const layoutDef = isValidUnsavedLayout
    ? unsavedLayoutDef
    : isValidSavedLayout
      ? currentSavedLayout
      : lastLayoutDef

  const layoutIsDirty = useSelector(state => state.ui.layoutIsDirty)

  const onLoadLayout = useCallback(() => {
    // generate default layout
    const nextLayout = generateLayout(layoutConfig)
    if (layoutDef?.layout && (layoutIsDirty || !layoutDef.isDefault)) {
      nextLayout[breakpoint] = [...layoutDef?.layout]
    }

    return nextLayout
  }, [breakpoint, layoutConfig, layoutDef, layoutIsDirty])

  const nextLayouts = useMemo(() => onLoadLayout(), [onLoadLayout])

  useEffect(() => {
    // set active layout id when there’s none selected (on initial load)
    // or when switching routes
    if (!layoutID || !isValidSavedLayout) {
      dispatch(setLayoutID(lastLayoutID))
    }
  }, [pathname, layoutID, lastLayoutID, isValidSavedLayout, dispatch])

  useEffect(() => {
    // discard unsaved layout changes
    if (!isValidUnsavedLayout) {
      dispatch(storeUnsavedLayout(layoutDef))
    }
  }, [dispatch, isValidUnsavedLayout, layoutDef])

  const componentProps = {
    orderForm: orderFormProps,
    trades: tradesProps,
    chart: chartProps,
    book: bookProps,
    dark: true,
    sharedProps,
  }

  const onRemoveComponent = (i) => dispatch(removeComponent(i))

  useEffect(() => {
    setMounted(true)
  }, [])

  /* fix-start: initial grid rendering issue
  * when screen is loaded the grids are arranged in stack of items instead of in a linear manner.
  * https://github.com/react-grid-layout/react-grid-layout/issues/879
  */
  useEffect(() => {
    if (mounted) {
      setTimeout(() => { window.dispatchEvent(new Event('resize')) }, 200)
    }
  }, [mounted])
  /* fix-end: initial grid rendering issue */

  const onLayoutChange = (layout) => {
    dispatch(changeLayout(layout))
  }

  const currentLayout = nextLayouts?.[breakpoint] || []

  return (
    <div className='hfui-gridlayoutpage__wrapper'>
      <ReactGridLayout
        draggableHandle='.icon-move'
        cols={GRID_COLUMNS}
        breakpoints={GRID_BREAKPOINTS}
        margin={GRID_CELL_SPACINGS}
        containerPadding={GRID_CONTAINER_SPACINGS}
        rowHeight={GRID_ROW_HEIGHT}
        layouts={nextLayouts}
        onBreakpointChange={setBreakpoint}
        onLayoutChange={onLayoutChange}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
      >
        {_map(currentLayout, def => (
          <div key={def.i}>
            {renderLayoutElement(layoutID, def, componentProps, onRemoveComponent)}
          </div>
        ))}
      </ReactGridLayout>
    </div>
  )
}

GridLayout.propTypes = {
  chartProps: PropTypes.shape({
    disableToolbar: PropTypes.bool,
    activeMarket: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.number,
        PropTypes.bool,
      ]),
    ),
  }),
  bookProps: PropTypes.shape({
    canChangeStacked: PropTypes.bool,
  }),
  tradesProps: PropTypes.objectOf(PropTypes.bool),
  orderFormProps: PropTypes.shape({
    orders: PropTypes.arrayOf(PropTypes.object),
  }),
  sharedProps: PropTypes.objectOf(PropTypes.oneOfType(
    [PropTypes.bool, PropTypes.string],
  )),
}

GridLayout.defaultProps = {
  chartProps: {
    disableToolbar: true,
  },
  bookProps: { canChangeStacked: true },
  tradesProps: {},
  orderFormProps: { orders: [] },
  sharedProps: {},
}

export default memo(GridLayout)
