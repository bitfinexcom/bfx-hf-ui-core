import React, { memo, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import _includes from 'lodash/includes'

import { STEPS, STATUS } from '../../components/Joyride'
import Layout from '../../components/Layout'
import GridLayout from '../../components/GridLayout'
import useTourGuide from '../../hooks/useTourGuide'

import './style.css'

const Joyride = lazy(() => import('../../components/Joyride'))

const commonComponentProps = {
  dark: true,
  darkHeader: true,
  showMarket: true,
  canChangeMarket: true,
  showChartMarket: true,
}

const MarketData = ({ isGuideActive, isFirstLogin, finishGuide }) => {
  const { t } = useTranslation()

  const showGuide = useTourGuide(isGuideActive)

  const onGuideFinish = (data) => {
    const { status } = data
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED]
    const CLOSE = 'close'
    if (_includes(finishedStatuses, status) || data.action === CLOSE) {
      finishGuide()
    }
  }

  return (
    <Layout>
      <Layout.Header />
      <Layout.Main>
        {isFirstLogin && (
          <Suspense fallback={<></>}>
            <Joyride
              callback={onGuideFinish}
              steps={STEPS.getMarketModes(t)}
              run={showGuide}
            />
          </Suspense>
        )}
        <GridLayout
          tradesProps={commonComponentProps}
          bookProps={commonComponentProps}
          chartProps={commonComponentProps}
        />
      </Layout.Main>
      <Layout.Footer />
    </Layout>
  )
}

MarketData.propTypes = {
  finishGuide: PropTypes.func.isRequired,
  isGuideActive: PropTypes.bool.isRequired,
  isFirstLogin: PropTypes.bool.isRequired,
}

export default memo(MarketData)
