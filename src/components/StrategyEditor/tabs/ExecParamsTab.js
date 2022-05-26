import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import ExecutionOptionsBody from '../../../modals/Strategy/ExecutionOptionsModal/ExecutionOptionsBody'

const ExecParamsTab = (props) => {
  const { t } = useTranslation()

  return (
    <div className='hfui-strategyeditor__wrapper hfui-execution-tab'>
      <ExecutionOptionsBody t={t} {...props} />
    </div>
  )
}

ExecParamsTab.propTypes = {
  capitalAllocation: PropTypes.string.isRequired,
  capitalAllocationError: PropTypes.string.isRequired,
  capitalAllocationHandler: PropTypes.func.isRequired,
  stopLossPerc: PropTypes.string.isRequired,
  setStopLossPerc: PropTypes.func.isRequired,
  maxDrawdownPerc: PropTypes.string.isRequired,
  setMaxDrawdownPerc: PropTypes.func.isRequired,
}

export default ExecParamsTab
