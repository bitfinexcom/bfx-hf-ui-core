import getLayouts from './get_layouts'

export default (state, id) => getLayouts(state)?.[id]
