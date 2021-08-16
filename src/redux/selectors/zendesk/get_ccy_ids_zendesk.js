import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.ZENDESK
const EMPTY_OBJ = {}

const getCcyIdsZendesk = (state) => _get(state, `${path}.ccyArticleIdsMap`, EMPTY_OBJ)

export default getCcyIdsZendesk
