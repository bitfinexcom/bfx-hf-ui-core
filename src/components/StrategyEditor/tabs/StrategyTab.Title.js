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

  const getTabTitle = () => {
    if (loading) {
      return (
        <>
          {sidebarOpened && (
            <span className='title-label--indicator'>{title}</span>
          )}
          <Indicator white blinking />
        </>
      )
    }
    if (executing) {
      return (
        <>
          {sidebarOpened && (
            <span className='title-label--indicator'>{title}</span>
          )}
          <Indicator red blinking={!isStrategyTabSelected} />
        </>
      )
    }
    if (!_isEmpty(results)) {
      return (
        <>
          {sidebarOpened && (
            <span className='title-label--indicator'>{title}</span>
          )}
          <Indicator green />
        </>
      )
    }
    return (
      <>
        {sidebarOpened && <span>{title}</span>}
      </>
    )
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
      {getTabTitle()}
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
