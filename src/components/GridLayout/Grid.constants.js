import { isElectronApp } from '../../redux/config'

// breakpoint keys
export const GRID_LARGE = 'lg'
export const GRID_MEDIUM = 'md'
export const GRID_SMALL = 'sm'
export const GRID_XSMALL = 'xs'

// columns
const GRID_COLUMNS_LG = isElectronApp ? 100 : 100
const GRID_COLUMNS_MD = isElectronApp ? 100 : 100
const GRID_COLUMNS_SM = isElectronApp ? 100 : 50
const GRID_COLUMNS_XS = isElectronApp ? 100 : 50

// breakpoints
const GRID_BREAKPOINT_LG = 1200
const GRID_BREAKPOINT_MD = 996
const GRID_BREAKPOINT_SM = 768
const GRID_BREAKPOINT_XS = 480

// config
export const GRID_CELL_SPACING = [20, 20]
export const GRID_CONTAINER_SPACINGS = [0, 0]
export const GRID_ROW_HEIGHT = 32

export const GRID_BREAKPOINTS = {
  [GRID_LARGE]: GRID_BREAKPOINT_LG,
  [GRID_MEDIUM]: GRID_BREAKPOINT_MD,
  [GRID_SMALL]: GRID_BREAKPOINT_SM,
  [GRID_XSMALL]: GRID_BREAKPOINT_XS,
}

export const GRID_COLUMNS = {
  [GRID_LARGE]: GRID_COLUMNS_LG,
  [GRID_MEDIUM]: GRID_COLUMNS_MD,
  [GRID_SMALL]: GRID_COLUMNS_SM,
  [GRID_XSMALL]: GRID_COLUMNS_XS,
}

export const GRID_CELL_SPACINGS = {
  [GRID_LARGE]: GRID_CELL_SPACING,
  [GRID_MEDIUM]: GRID_CELL_SPACING,
  [GRID_SMALL]: GRID_CELL_SPACING,
  [GRID_XSMALL]: GRID_CELL_SPACING,
}
