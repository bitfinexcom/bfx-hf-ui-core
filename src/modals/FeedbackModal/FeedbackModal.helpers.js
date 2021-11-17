export const REASON_TYPES = {
  BUG_REPORT: 'bug_report',
  FEATURE_REQUEST: 'feature_request',
  OTHER: 'other',
}

export const getReasonLabels = (t) => ({
  [REASON_TYPES.BUG_REPORT]: t(`feedbackModal.feedbackReasons.${REASON_TYPES.BUG_REPORT}`),
  [REASON_TYPES.FEATURE_REQUEST]: t(`feedbackModal.feedbackReasons.${REASON_TYPES.FEATURE_REQUEST}`),
  [REASON_TYPES.OTHER]: t(`feedbackModal.feedbackReasons.${REASON_TYPES.OTHER}`),
})
