import { createSelector } from 'reselect'
import _get from 'lodash/get'
import _filter from 'lodash/filter'
import _entries from 'lodash/entries'
import _find from 'lodash/find'
import _last from 'lodash/last'

import getLayoutID from '../get_layout_id'
import getLayouts from '../get_layouts'
import getCurrentUnsavedLayout from '../get_current_unsaved_layout'
import { getLastUsedLayoutID } from '../../../../util/layout'

const EMPTY_OBJ = {}

const getLayoutForRoute = createSelector(
  getLayouts,
  getLayoutID,
  getCurrentUnsavedLayout,
  (state, pathname) => pathname,
  (layouts, layoutID, unsavedLayoutDef, pathname) => {
    const savedLayout = _get(layouts, layoutID, EMPTY_OBJ)
    const isMatchingUnsavedLayout = _get(unsavedLayoutDef, 'routePath', null) === pathname
    const isMatchingSavedLayout = savedLayout.routePath === pathname

    const layoutsForCurrRoute = _filter(_entries(layouts), ([, layout]) => layout.routePath === pathname)
    const lastUsedLayoutID = getLastUsedLayoutID(pathname)

    const [lastLayoutID, lastLayoutDef] = _find(layoutsForCurrRoute, ([id]) => id === lastUsedLayoutID) || _last(layoutsForCurrRoute
      .sort((a, b) => a[1].savedAt - b[1].savedAt)) || []

    // select layout in order:
    // 1. any matching unsaved layout
    // 2. matching saved layout
    // 3. last used or last saved layout
    const layoutDef = isMatchingUnsavedLayout
      ? unsavedLayoutDef
      : isMatchingSavedLayout ? savedLayout : lastLayoutDef

    return [lastLayoutID, layoutDef, isMatchingUnsavedLayout, isMatchingSavedLayout]
  },
)

export default getLayoutForRoute
