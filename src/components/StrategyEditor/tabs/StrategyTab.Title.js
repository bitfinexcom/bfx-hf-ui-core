import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import { Icon } from 'react-fa'
import StrategiesMenuSideBarParams from '../components/StrategiesMenuSideBarParams'
import Indicator from '../../../ui/Indicator'

const StrategyTabTitle = (props) => {
  const { executionResults, selectedTab, sidebarOpened } = props
  const { results, executing, loading } = executionResults

  const [paramsOpen, setParamsOpen] = useState(false)

  const { t } = useTranslation()
  const title = t('strategyEditor.strategyTab')

  const isStrategyTabSelected = selectedTab === 0

  const getIndicator = () => {
    if (loading) {
      return <Indicator white blinking />
    }
    if (executing) {
      return <Indicator red blinking={!isStrategyTabSelected} />
    }
    if (!_isEmpty(results)) {
      return <Indicator green />
    }
    return null
  }

  const closeParams = () => setParamsOpen(false)

  useEffect(() => {
    if (selectedTab === 0) {
      setParamsOpen(true)
    }
  }, [selectedTab])

  return (
    <div className='hfui-strategyeditor__sidebar-title'>
      <Icon name='file-code-o' className='title-icon' />
      {sidebarOpened && <span className='title-label'>{title}</span>}
      {getIndicator()}
      {paramsOpen && (
        <OutsideClickHandler onOutsideClick={closeParams}>
          <StrategiesMenuSideBarParams
            {...props}
            executing={executing}
            closeParams={closeParams}
          />
        </OutsideClickHandler>
      )}
    </div>
  )
}

StrategyTabTitle.propTypes = {
  executionResults: PropTypes.shape({
    executing: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    results: PropTypes.object,
    loading: PropTypes.bool,
  }).isRequired,
  selectedTab: PropTypes.number.isRequired,
  sidebarOpened: PropTypes.bool.isRequired,
}

export default StrategyTabTitle
