import React, { memo } from 'react'

import Layout from '../../components/Layout'
import GridLayout from '../../components/GridLayout'

import './style.css'

const commonComponentProps = {
  dark: true,
  moveable: true,
  removeable: true,
  darkHeader: true,
  showMarket: true,
  canChangeMarket: true,
  showChartMarket: true,
}

const MarketData = () => {
  return (
    <Layout>
      <Layout.Header />
      <Layout.Main>
        <GridLayout
          tradesProps={commonComponentProps}
          bookProps={commonComponentProps}
          chartProps={commonComponentProps}
          sharedProps={commonComponentProps}
        />
      </Layout.Main>
      <Layout.Footer />
    </Layout>
  )
}

MarketData.propTypes = { }

export default memo(MarketData)
