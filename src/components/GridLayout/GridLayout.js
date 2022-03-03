import React, {
  memo, useCallback, useEffect, useState,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _forEach from 'lodash/forEach'
import _keys from 'lodash/keys'
import { Responsive as RGL, WidthProvider } from 'react-grid-layout'
import { Spinner } from '@ufx-ui/core'

import { useLocation } from 'react-router'
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
  getLayoutID,
  getLayoutForRoute,
} from '../../redux/selectors/ui'

import { generateLayout } from './Grid.layouts'
import tradingTerminalLayout from './layouts/trading'
import marketDataLayout from './layouts/marketData'
import { marketData } from '../../constants/routes'

import './style.scss'

const ReactGridLayout = WidthProvider(RGL)

const getLayoutConfig = pathname => (pathname === marketData.path ? marketDataLayout : tradingTerminalLayout)

const GridLayout = ({
  sharedProps, tradesProps, bookProps, chartProps, orderFormProps,
}) => {
  const dispatch = useDispatch()
  const [breakpoint, setBreakpoint] = useState(RGL.utils.getBreakpointFromWidth(GRID_BREAKPOINTS, document.body.clientWidth))

  const { pathname } = useLocation()
  const layoutConfig = useMemo(() => getLayoutConfig(pathname), [pathname])
  const layoutID = useSelector(getLayoutID)

  const layoutIsDirty = useSelector(state => state.ui.layoutIsDirty)
  const [lastLayoutID, layoutDef, isMatchingUnsavedLayout, isMatchingSavedLayout] = useSelector(state => getLayoutForRoute(state, pathname))

  const onLoadLayout = useCallback(() => {
    // generate default layout
    const nextLayout = generateLayout(layoutConfig)
    if (layoutDef?.layout && (layoutIsDirty || !layoutDef.isDefault)) {
      _forEach(_keys(nextLayout), (bp) => {
        nextLayout[bp] = [...layoutDef?.layout]
      })
    }

    return nextLayout
  }, [layoutConfig, layoutDef, layoutIsDirty])

  const nextLayouts = useMemo(() => onLoadLayout(), [onLoadLayout])

  useEffect(() => {
    // set active layout id when there’s none selected (on initial load)
    // or when switching routes
    if (!layoutID || !isMatchingSavedLayout) {
      dispatch(setLayoutID(lastLayoutID))
    }
  }, [pathname, layoutID, lastLayoutID, isMatchingSavedLayout, dispatch])

  useEffect(() => {
    // discard unsaved layout changes
    if (!isMatchingUnsavedLayout) {
      dispatch(storeUnsavedLayout(layoutDef))
    }
  }, [dispatch, isMatchingUnsavedLayout, layoutDef])

  const componentProps = useMemo(() => ({
    orderForm: orderFormProps,
    trades: tradesProps,
    chart: chartProps,
    book: bookProps,
    dark: true,
    sharedProps,
  }), [bookProps, chartProps, orderFormProps, sharedProps, tradesProps])

  const onRemoveComponent = useCallback((i) => dispatch(removeComponent(i)), [dispatch])

  /* fix-start: initial grid rendering issue
  * when screen is loaded the grids are arranged in stack of items instead of in a linear manner.
  * https://github.com/react-grid-layout/react-grid-layout/issues/879
  */
  useEffect(() => {
    setTimeout(() => { window.dispatchEvent(new Event('resize')) }, 200)
  }, [])
  /* fix-end: initial grid rendering issue */

  const onLayoutChange = useCallback((layout) => {
    dispatch(changeLayout(layout))
  }, [dispatch])

  const currentLayout = nextLayouts?.[breakpoint] || []

  if (!layoutID) {
    return <Spinner className='grid-spinner' />
  }

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
