import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.AOS

const EMPTY_OBJ = {}

const getFailedRecurringAoAtomics = (state) => _get(state, `${path}.failedRecurringAoAtomics`, EMPTY_OBJ)

export default getFailedRecurringAoAtomics
