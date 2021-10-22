import React, {
  memo, useCallback, lazy, Suspense,
} from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import _includes from 'lodash/includes'

import Layout from '../../components/Layout'
import { STEPS, STATUS } from '../../components/Joyride'
import GridLayout from '../../components/GridLayout'
import ActiveAlgoOrdersModal from '../../modals/ActiveAlgoOrdersModal'
// import RefillBalanceModal from '../../modals/RefillBalanceModal'

import './style.css'

const Joyride = lazy(() => import('../../components/Joyride'))

const LAYOUT_ID = '__hfui_trading_page'

const commonComponentProps = {
  dark: true,
  moveable: true,
  removeable: true,
  showMarket: true,
  layoutID: LAYOUT_ID,
  showChartMarket: false,
  canChangeMarket: false,
}

const Trading = ({
  firstLogin,
  isGuideActive,
  showAlgoModal,
  apiClientConnected,
  hasActiveAlgoOrders,
  finishGuide,
  isBadConnection,
}) => {
  const { t } = useTranslation()

  const onGuideFinish = useCallback((data) => {
    const { status } = data
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED]
    const CLOSE = 'close'
    if (_includes(finishedStatuses, status) || data.action === CLOSE) {
      finishGuide()
    }
  }, [finishGuide])

  return (
    <Layout>
      <Layout.Header />
      <Layout.Main flex>
        {firstLogin && (
          <Suspense fallback={<></>}>
            <Joyride
              callback={onGuideFinish}
              steps={STEPS.getTradingModes(t)}
              run={isGuideActive}
            />
          </Suspense>
        )}

        <div className='hfui-tradingpage__column center'>
          <GridLayout
            sharedProps={commonComponentProps}
          />
        </div>

        <ActiveAlgoOrdersModal isOpen={showAlgoModal && hasActiveAlgoOrders && apiClientConnected && !isBadConnection} />
        {/* <RefillBalanceModal /> */}
      </Layout.Main>
      <Layout.Footer />
    </Layout>
  )
}

Trading.propTypes = {
  firstLogin: PropTypes.bool,
  showAlgoModal: PropTypes.bool,
  isGuideActive: PropTypes.bool,
  apiClientConnected: PropTypes.bool,
  hasActiveAlgoOrders: PropTypes.bool,
  finishGuide: PropTypes.func.isRequired,
  isBadConnection: PropTypes.bool.isRequired,
}

Trading.defaultProps = {
  firstLogin: false,
  showAlgoModal: false,
  apiClientConnected: false,
  hasActiveAlgoOrders: false,
  isGuideActive: true,
}

export default memo(Trading)
