import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.AOS

const EMPTY_OBJ = {}

const getFailedRecurringAOAtomics = (state) => _get(state, `${path}.failedRecurringAOAtomics`, EMPTY_OBJ)

export default getFailedRecurringAOAtomics
