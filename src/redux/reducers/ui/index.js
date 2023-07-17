import Debug from 'debug'
import _get from 'lodash/get'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import _cloneDeep from 'lodash/cloneDeep'
import _min from 'lodash/min'
import _max from 'lodash/max'
import _map from 'lodash/map'
import _reduce from 'lodash/reduce'
import _entries from 'lodash/entries'
import _values from 'lodash/values'
import _some from 'lodash/some'
import _isUndefined from 'lodash/isUndefined'
import _findIndex from 'lodash/findIndex'
import _includes from 'lodash/includes'
import _isArray from 'lodash/isArray'
import { nonce } from 'bfx-api-node-util'
import { VOLUME_UNIT, VOLUME_UNIT_PAPER } from '@ufx-ui/bfx-containers'

import types from '../../constants/ui'
import Routes from '../../../constants/routes'
import DEFAULT_TRADING_LAYOUT from './default_layout_trading'
import DEFAULT_MARKET_DATA_LAYOUT from './default_layout_market_data'
import DEFAULT_TRADING_COMPONENT_STATE from './default_component_state_trading'
import DEFAULT_MARKET_DATA_COMPONENT_STATE from './default_component_state_market_data'
import DEFAULT_ACTIVE_MARKET_STATE from './default_active_market_state'

import {
  COMPONENT_DIMENSIONS,
  DEFAULT_TRADING_KEY,
  DEFAULT_MARKET_KEY,
  layoutDefToGridLayout,
  gridLayoutToLayoutDef,
} from '../../../components/GridLayout/GridLayout.helpers'
import { appVersion, isElectronApp, isRCVersion } from '../../config'

import { storeLastUsedLayoutID } from '../../../util/layout'
import { DEFAULT_TAB } from '../../../modals/AppSettingsModal/AppSettingsModal.constants'
import { UI_MODAL_KEYS } from '../../constants/modals'
import { getIsPaperPair } from '../../../util/market'

const debug = Debug('hfui:rx:r:ui')
const LAYOUTS_KEY = 'HF_UI_LAYOUTS'
const LAYOUTS_STATE_KEY = 'HF_UI_LAYOUTS_STATE'
const ACTIVE_MARKET_KEY = 'HF_UI_ACTIVE_MARKET'
const ACTIVE_MARKET_PAPER_KEY = 'HF_UI_PAPER_ACTIVE_MARKET'
export const ALLOWED_RC_VERSIONS = 'HF_UI_ALLOWED_RC_VERSIONS'
export const IS_PAPER_TRADING = 'IS_PAPER_TRADING'
export const PAPER_MODE = 'paper'
export const MAIN_MODE = 'main'
let shownOldFormatModal = false

const DEFAULT_MARKET = {
  contexts: ['e', 'm'],
  restID: 'tBTCUSD',
  wsID: 'tBTCUSD',
  base: 'BTC',
  quote: 'USD',
  uiID: 'BTC/USD',
}

const getActiveLayoutDef = state => (!_isEmpty(state.unsavedLayout)
  ? state.unsavedLayout
  : _get(state, `layouts.${state.layoutID}`, {}))

function getInitialState() {
  const defaultState = {
    activeMarket: DEFAULT_MARKET,
    notificationsVisible: false,
    previousMarket: null,
    remoteVersion: null,
    isPaperTrading: false,
    modals: {},
    orderToEdit: {},
    isBadInternetConnection: false,
    isNoConnectionModalVisible: false,
    closePositionModalData: {},
    isOrderExecuting: false,
    strategyEditor: {
      strategyMainMode: {},
      strategySandboxMode: {},
      isStrategyDirty: false,
    },
    unsavedLayout: null,
    layoutID: null,
    settingsActiveTab: DEFAULT_TAB,
    tickersVolumeUnit: null,
    isApplicationHidden: false,
    isFullscreenBarShown: false,
    isRCDisclaimerShown: false,
    pendo: {
      isInitialized: false,
    },
  }

  _map(_values(UI_MODAL_KEYS), (modalKey) => {
    defaultState.modals[`is${modalKey}Open`] = false
  })

  if (!localStorage) {
    return defaultState
  }

  const isPaperTrading = localStorage.getItem(IS_PAPER_TRADING) === 'true'
  const layoutsJSON = localStorage.getItem(LAYOUTS_KEY)
  const layoutsComponentStateJSON = localStorage.getItem(LAYOUTS_STATE_KEY)

  try {
    const storedLayouts = JSON.parse(layoutsJSON)

    const isNewFormat = !_some(
      _values(storedLayouts),
      layout => _isUndefined(layout.savedAt),
    )

    // transform old format to new format for compatibility
    const nextFormatLayouts = isNewFormat ? storedLayouts : _reduce(
      _entries(storedLayouts),
      (nextLayouts, [key, layout]) => {
        const routePath = layout.type === 'data'
          ? Routes.marketData.path
          : Routes.tradingTerminal.path

        return {
          ...nextLayouts,
          // Previously stored default layout could have been edited
          // so store them without newly added ' Layout' suffix key
          // and set isDefault false and canDelete true
          [key]: {
            ...layout,
            routePath,
            isDefault: false,
            canDelete: true,
            savedAt: Date.now(),
          },
        }
      },
      {
        [DEFAULT_TRADING_KEY]: DEFAULT_TRADING_LAYOUT,
        [DEFAULT_MARKET_KEY]: DEFAULT_MARKET_DATA_LAYOUT,
      },
    )

    // saving reformatted layouts into the local storage
    if ((!isNewFormat && !_isEmpty(storedLayouts)) || shownOldFormatModal) {
      shownOldFormatModal = true
      defaultState.modals.isOldFormatModalVisible = true
      localStorage.setItem(LAYOUTS_KEY, JSON.stringify(nextFormatLayouts))
    }

    if (isRCVersion) {
      const allowedRCVersionsJSON = localStorage.getItem(ALLOWED_RC_VERSIONS)
      let showModal = true

      if (allowedRCVersionsJSON) {
        const allowedRCVersions = JSON.parse(allowedRCVersionsJSON)

        if (_isArray(allowedRCVersions) && _includes(allowedRCVersions, appVersion)) {
          showModal = false
        }
      }

      defaultState.isRCDisclaimerShown = showModal
    }

    defaultState.layouts = nextFormatLayouts
  } catch (e) {
    debug('Loading layouts error, check localStorage: %s', LAYOUTS_KEY)
  }

  try {
    defaultState.layoutComponentState = JSON.parse(layoutsComponentStateJSON)
  } catch (e) {
    debug('Loading layouts state error, check localStorage: %s', LAYOUTS_STATE_KEY)
  }

  if (!defaultState.layouts) {
    defaultState.layouts = {
      [DEFAULT_TRADING_KEY]: DEFAULT_TRADING_LAYOUT,
      [DEFAULT_MARKET_KEY]: DEFAULT_MARKET_DATA_LAYOUT,
    }
  }

  if (!defaultState.layoutComponentState) {
    defaultState.layoutComponentState = {
      [DEFAULT_TRADING_KEY]: DEFAULT_TRADING_COMPONENT_STATE,
      [DEFAULT_MARKET_KEY]: DEFAULT_MARKET_DATA_COMPONENT_STATE,
    }
  }

  defaultState.isPaperTrading = isPaperTrading

  return defaultState
}

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = {} } = action

  switch (type) {
    case types.SET_UI_VALUE: {
      const { key, value } = payload

      return {
        ...state,
        [key]: value,
      }
    }

    case types.UPDATE_UI_VALUE: {
      const { key, value } = payload

      return {
        ...state,
        [key]: {
          ...(state?.[key] || {}),
          ...value,
        },
      }
    }

    case types.SAVE_REMOTE_VERSION: {
      const { version } = payload

      return {
        ...state,
        remoteVersion: version,
      }
    }

    case types.SAVE_LAYOUT: {
      return {
        ...state,
        layoutIsDirty: false,
        layouts: {
          ...state.layouts,
          [state.layoutID]: {
            ...state?.unsavedLayout,
            isDefault: false,
            canDelete: true,
            savedAt: Date.now(),
          },
        },
      }
    }

    case types.CREATE_LAYOUT: {
      const { id } = payload
      const layoutDef = getActiveLayoutDef(state)
      const { layoutComponentState, layoutID } = state || {}

      storeLastUsedLayoutID(id, layoutDef?.routePath)

      return {
        ...state,
        layoutIsDirty: false,
        unsavedLayout: null,
        layouts: {
          ...state.layouts,
          [id]: {
            ...layoutDef,
            isDefault: false,
            canDelete: true,
            savedAt: Date.now(),
          },
        },
        layoutID: id,
        layoutComponentState: {
          ...layoutComponentState,
          [id]: {
            ...layoutComponentState?.[layoutID],
          },
        },
      }
    }

    case types.DELETE_LAYOUT: {
      const { id } = payload
      const { [id]: delLayout, ...remainingLayouts } = state.layouts
      const { [id]: delState, ...remainingStates } = state.layoutComponentState

      return {
        ...state,
        layouts: remainingLayouts,
        layoutComponentState: remainingStates,
      }
    }

    case types.SAVE_COMPONENT_STATE: {
      const {
        layoutID, componentID, state: componentState = {},
      } = payload

      return {
        ...state,
        layoutComponentState: {
          ...state.layoutComponentState,
          [layoutID]: {
            ...(state.layoutComponentState[layoutID] || {}),
            [componentID]: componentState,
          },
        },
      }
    }

    case types.UPDATE_COMPONENT_STATE: {
      const {
        layoutID, componentID, state: componentState = {},
      } = payload

      return {
        ...state,
        layoutComponentState: {
          ...state.layoutComponentState,
          [layoutID]: {
            ...(state.layoutComponentState[layoutID] || {}),
            [componentID]: {
              ...(_get(state, ['layoutComponentState', layoutID, componentID], {})),
              ...componentState,
            },
          },
        },
      }
    }

    case types.SET_ACTIVE_MARKET: {
      const { market } = payload

      return {
        ...state,
        previousMarket: state.activeMarket,
        activeMarket: market,
      }
    }

    case types.SET_MARKET_FROM_STORE: {
      const { isPaperTrading } = payload
      const mode = isPaperTrading ? PAPER_MODE : MAIN_MODE
      const activeMarketJSON = localStorage.getItem(isPaperTrading ? ACTIVE_MARKET_PAPER_KEY : ACTIVE_MARKET_KEY)
      const savedMarket = JSON.parse(activeMarketJSON)
      const activeMarket = (!isPaperTrading || getIsPaperPair(savedMarket)) && !!savedMarket ? savedMarket : DEFAULT_ACTIVE_MARKET_STATE[mode].activeMarket

      return {
        ...state,
        previousMarket: state.activeMarket,
        currentMode: mode,
        activeMarket,
      }
    }

    case types.SET_CURRENT_STRATEGY: {
      const { strategy, mode } = payload
      const { isPaperTrading } = state

      let key = null
      if (!mode) {
        key = isPaperTrading ? 'strategySandboxMode' : 'strategyMainMode'
      } else {
        key = mode === PAPER_MODE ? 'strategySandboxMode' : 'strategyMainMode'
      }

      return {
        ...state,
        strategyEditor: {
          ...state.strategyEditor,
          [key]: strategy,
        },
      }
    }

    case types.SET_IS_STRATEGY_DIRTY: {
      const { isStrategyDirty } = payload
      const { isPaperTrading } = state

      // Strategy can be dirty only in sandbox (paper) mode
      if (!isPaperTrading) {
        return state
      }

      return {
        ...state,
        strategyEditor: {
          ...state.strategyEditor,
          isStrategyDirty,
        },
      }
    }

    case types.SET_TRADING_MODE: {
      const { isPaperTrading } = payload
      const mode = isPaperTrading ? PAPER_MODE : MAIN_MODE

      if (isElectronApp) {
        localStorage.setItem(IS_PAPER_TRADING, isPaperTrading)
      }

      return {
        ...state,
        isPaperTrading,
        currentMode: mode,
        tickersVolumeUnit: isPaperTrading ? VOLUME_UNIT_PAPER.TESTUSD : VOLUME_UNIT.USD,
      }
    }

    case types.ADD_COMPONENT: {
      const { component } = payload
      const layoutDef = getActiveLayoutDef(state)
      const x = _min(_map(layoutDef.layout, l => l.x)) || 0
      const y = _max(_map(layoutDef.layout, l => l.y)) || 0

      const newY = y + layoutDef.layout[layoutDef?.layout?.length - 1]?.h

      return {
        ...state,
        layoutIsDirty: true,
        unsavedLayout: {
          ...layoutDef,
          layout: [
            ...layoutDef.layout,
            {
              i: `${nonce()}`,
              c: component,
              x,
              y: newY,
              // default props (undefined/false) are added to avoid re-renders, otherwise react-grid-layout calls onLayoutChange with default props and it triggers re-render
              isBounded: undefined,
              isDraggable: undefined,
              isResizable: undefined,
              maxH: undefined,
              maxW: undefined,
              minW: undefined,
              resizeHandles: undefined,
              moved: false,
              static: false,
              ...COMPONENT_DIMENSIONS[component],
            },
          ],
        },
      }
    }

    case types.REMOVE_COMPONENT: {
      const { i } = payload
      const newLayoutDef = _cloneDeep(getActiveLayoutDef(state))
      const index = _findIndex(newLayoutDef.layout, l => l.i === i)

      if (index >= 0) {
        newLayoutDef.layout.splice(index, 1)
      }

      return {
        ...state,
        layoutIsDirty: true,
        unsavedLayout: newLayoutDef,
      }
    }

    case types.CHANGE_LAYOUT: {
      const { incomingLayout } = payload
      const layoutDef = getActiveLayoutDef(state)

      // happens on deletion before we set the next layout
      if (_isEmpty(layoutDef) || _isEmpty(layoutDef.layout)) {
        return state
      }

      const currentLayout = layoutDefToGridLayout(layoutDef)
      const newLayout = layoutDefToGridLayout({ layout: incomingLayout })
      const setIsDirty = !_isEqual(currentLayout, newLayout)

      const updated = gridLayoutToLayoutDef({
        ...layoutDef,
        layout: incomingLayout,
      }, layoutDef)

      if (_isEqual(state.unsavedLayout, updated)) {
        return state
      }

      return {
        ...state,
        ...setIsDirty && { layoutIsDirty: true },
        unsavedLayout: updated,
      }
    }

    case types.SELECT_LAYOUT: {
      const { id, routePath } = payload

      storeLastUsedLayoutID(id, routePath)

      return {
        ...state,
        unsavedLayout: null,
        layoutIsDirty: false,
        layoutID: id,
      }
    }

    case types.CHANGE_TICKERS_VOLUME_UNIT: {
      const { key } = payload
      const { isPaperTrading } = state
      const unit = isPaperTrading ? VOLUME_UNIT_PAPER[key] : VOLUME_UNIT[key]

      return { ...state, tickersVolumeUnit: unit || 'SELF' }
    }

    case types.CHANGE_UI_MODAL_STATE: {
      const { key, isOpen } = payload

      return {
        ...state,
        modals: {
          ...state.modals,
          [`is${key}Open`]: isOpen,
        },
      }
    }

    case types.TOGGLE_UI_MODAL_STATE: {
      const { key } = payload
      const modalKey = `is${key}Open`
      const currModalState = state.modals?.[modalKey]

      return {
        ...state,
        modals: {
          ...state.modals,
          [modalKey]: !currModalState,
        },
      }
    }

    case types.SET_SETTINGS_TAB: {
      const { tab, section } = payload

      return {
        ...state,
        settingsActiveTab: tab,
        settingsActiveSection: section,
      }
    }

    case types.UPDATE_SERVICE_STATUS: {
      const { mode, serviceStatus } = payload
      return {
        ...state,
        serviceStatus: {
          ...state.serviceStatus,
          [mode]: serviceStatus,
        },
      }
    }

    case types.SET_PENDO_STATE: {
      return {
        ...state,
        pendo: { ...payload },
      }
    }

    default: {
      return state
    }
  }
}

function reducerWithStorage(state = getInitialState(), action = {}) {
  const newState = reducer(state, action)

  if (localStorage) {
    switch (action.type) {
      case types.SAVE_LAYOUT:
      case types.CREATE_LAYOUT:
      case types.DELETE_LAYOUT: {
        const { layoutComponentState, layouts } = newState
        localStorage.setItem(LAYOUTS_STATE_KEY, JSON.stringify(layoutComponentState))
        localStorage.setItem(LAYOUTS_KEY, JSON.stringify(layouts))
        break
      }

      case types.SAVE_COMPONENT_STATE: {
        const { layoutComponentState } = newState
        localStorage.setItem(LAYOUTS_STATE_KEY, JSON.stringify(layoutComponentState))
        break
      }

      case types.UPDATE_COMPONENT_STATE: {
        const { layoutComponentState } = newState
        localStorage.setItem(LAYOUTS_STATE_KEY, JSON.stringify(layoutComponentState))
        break
      }

      case types.SET_ACTIVE_MARKET: {
        const { activeMarket, isPaperTrading } = newState
        localStorage.setItem(isPaperTrading ? ACTIVE_MARKET_PAPER_KEY : ACTIVE_MARKET_KEY, JSON.stringify(activeMarket))
        break
      }

      default: {
        break
      }
    }
  }

  return newState
}

export default reducerWithStorage
