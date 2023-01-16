import ga from '../constants/ga'

const cancelAO = () => {
  return { type: ga.GA_CANCEL_AO }
}
const submitAO = () => {
  return { type: ga.GA_SUBMIT_AO }
}
const editAO = () => ({
  type: ga.GA_EDIT_AO,
})
const cancelAtomicOrder = () => {
  return { type: ga.GA_CANCEL_ATOMIC_ORDER }
}
const submitAtomicOrder = () => {
  return { type: ga.GA_SUBMIT_ATOMIC_ORDER }
}
const updateSettings = () => {
  return { type: ga.GA_UPDATE_SETTINGS }
}
const pageview = (page) => ({
  type: ga.GA_PAGEVIEW,
  payload: {
    page,
  },
})

const createStrategy = () => {
  return { type: ga.GA_CREATE_STRATEGY }
}

export default {
  pageview, cancelAO, cancelAtomicOrder, createStrategy, submitAO, submitAtomicOrder, updateSettings, editAO,
}
