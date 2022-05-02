import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import { Icon } from 'react-fa'
import StrategiesMenuSideBarParams from '../components/StrategiesMenuSideBarParams'
import Indicator from '../../../ui/Indicator'

const titleWithIndicatorStyles = {
  marginRight: '10px',
}

const StrategyTabTitle = (props) => {
  const { executionResults, selectedTab, sidebarOpened } = props
  const { results, executing, loading } = executionResults

  const [paramsOpen, setParamsOpen] = useState(false)

  const { t } = useTranslation()
  const title = t('strategyEditor.strategyTab')

  const getTabTitle = () => {
    if (loading) {
      return (
        <>
          <Icon name='file-code-o' />
          {sidebarOpened && (
            <span style={titleWithIndicatorStyles}>{title}</span>
          )}
          <Indicator white blinking />
        </>
      )
    }
    if (executing) {
      return (
        <>
          <Icon name='file-code-o' />
          {sidebarOpened && (
            <span style={titleWithIndicatorStyles}>{title}</span>
          )}
          <Indicator red blinking={!sidebarOpened} />
        </>
      )
    }
    if (!_isEmpty(results)) {
      return (
        <>
          <Icon name='file-code-o' />
          {sidebarOpened && (
            <span style={titleWithIndicatorStyles}>{title}</span>
          )}
          <Indicator green />
        </>
      )
    }
    return (
      <>
        <Icon name='file-code-o' />
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
    <>
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
    </>
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
