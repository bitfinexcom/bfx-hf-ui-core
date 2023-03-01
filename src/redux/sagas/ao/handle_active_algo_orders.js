import _isEmpty from 'lodash/isEmpty'
import _isArray from 'lodash/isArray'
import _forEach from 'lodash/forEach'
import { put, select, delay } from 'redux-saga/effects'
import { AOAdapter } from '../../adapters/ws'
import AOActions from '../../actions/ao'
import { getIsAutoResumeAOs } from '../../selectors/ui'
import resumeRemoveActiveAlgoOrders from './on_resume_remove_active_algo_orders_handler'

const prepareAOsList = (aos, shouldPrepareAOsForResume) => {
  if (_isEmpty(aos)) {
    return {
      AOs: [],
      AOsForResume: null,
    }
  }

  const AOs = []
  const AOsForResume = shouldPrepareAOsForResume ? [] : null

  _forEach(aos, (ao) => {
    const adapted = _isArray(ao) ? AOAdapter(ao) : ao
    AOs.push(adapted)

    if (shouldPrepareAOsForResume) {
      const resumeAO = {
        gid: adapted.gid,
        algoID: adapted.algoID,
      }
      AOsForResume.push(resumeAO)
    }
  })

  return {
    AOs,
    AOsForResume,
  }
}

export default function* handleActiveAlgoOrders({ payload }) {
  // Delay because the server spawns many identical messages
  yield delay(500)

  const [, , isAfterLogin, aos] = payload

  const { paper, main } = aos

  const shouldAutoResumeAOs = select(getIsAutoResumeAOs) && !isAfterLogin

  const { AOs: AOsMain, AOsForResume: AOsForResumeMain } = prepareAOsList(
    main,
    shouldAutoResumeAOs,
  )
  const { AOs: AOsPaper, AOsForResume: AOsForResumePaper } = prepareAOsList(
    paper,
    shouldAutoResumeAOs,
  )

  if (shouldAutoResumeAOs) {
    const resumeAOsPayload = {
      type: 'resume',
      selectedOrders: {
        main: AOsForResumeMain || [],
        paper: AOsForResumePaper || [],
      },
      unselectedOrders: {
        main: [],
        paper: [],
      },

    }

    yield resumeRemoveActiveAlgoOrders({ payload: resumeAOsPayload })
    return
  }
  const isAOsMainExists = !_isEmpty(AOsMain)
  const isAOsPaperExists = !_isEmpty(AOsPaper)

  if (isAOsMainExists) {
    yield put(AOActions.setActiveAlgoOrders(AOsMain, 'main', isAfterLogin))
  }
  if (isAOsPaperExists) {
    yield put(AOActions.setActiveAlgoOrders(AOsPaper, 'paper', isAfterLogin))
  }
  if (isAOsMainExists || isAOsPaperExists) {
    yield put(AOActions.showActiveOrdersModal(true))
  }
}
