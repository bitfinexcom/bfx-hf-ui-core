import React from 'react'
import cx from 'clsx'
import './style.css'

import Navbar from '../Navbar'
import StatusBar from '../StatusBar'
import { MIN_SAFE_WIDTH } from '../../constants/variables'

// eslint-disable-next-line react/prop-types
function Layout({ children, ...props }) {
  return (
    <div className='layout' {...props}>
      {children}
    </div>
  )
}

// eslint-disable-next-line react/prop-types
Layout.Header = function Header({
  // eslint-disable-next-line react/prop-types
  children, buttons, style: styleProp, ...props
}) {
  const style = {
    minWidth: MIN_SAFE_WIDTH,
    ...styleProp,
  }

  return (
    <header className='layout__header' style={style} {...props}>
      <Navbar />
      {children}
    </header>
  )
}

Layout.Main = function Main({
  // eslint-disable-next-line react/prop-types
  children, className, flex, noSpaceTop, style: styleProp, ...props
}) {
  const classes = cx('layout__main', className, {
    'is-flex': flex,
    'no-space-top': noSpaceTop,
  })
  const style = {
    minWidth: MIN_SAFE_WIDTH,
    ...styleProp,
  }

  return (
    <main className={classes} style={style} {...props}>
      {children}
    </main>
  )
}

// eslint-disable-next-line react/prop-types
Layout.Footer = function Footer({ children }) {
  return (
    <footer className='layout__footer'>
      <StatusBar />
      {children}
    </footer>
  )
}

export default Layout
