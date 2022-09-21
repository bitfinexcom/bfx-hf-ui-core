import React, { memo } from 'react'
import PropTypes from 'prop-types'

import Layout from '../../components/Layout'
import GridLayout from '../../components/GridLayout'
import ActiveAlgoOrdersModal from '../../modals/ActiveAlgoOrdersModal'
// import RefillBalanceModal from '../../modals/RefillBalanceModal'

import './style.css'

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
  showAlgoModal,
  apiClientConnected,
  hasActiveAlgoOrders,
  isBadConnection,
}) => {
  return (
    <Layout>
      <Layout.Header />
      <Layout.Main flex>
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
  showAlgoModal: PropTypes.bool,
  apiClientConnected: PropTypes.bool,
  hasActiveAlgoOrders: PropTypes.bool,
  isBadConnection: PropTypes.bool.isRequired,
}

Trading.defaultProps = {
  showAlgoModal: false,
  apiClientConnected: false,
  hasActiveAlgoOrders: false,
}

export default memo(Trading)
