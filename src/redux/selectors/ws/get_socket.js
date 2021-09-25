import t from '../../constants/ws'
import getSockets from './get_sockets'

const EMPTY_OBJ = {}

export default (alias = t.ALIAS_API_SERVER) => (state) => getSockets(state)?.[alias] || EMPTY_OBJ
