import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

const EMP_OBJ = {}

export default (state) => _get(state, `${path}.currentStrategy`, EMP_OBJ)
