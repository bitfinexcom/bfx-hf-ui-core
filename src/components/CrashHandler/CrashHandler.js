/* eslint-disable react/prop-types */
import React from 'react'
import Debug from 'debug'
import _isError from 'lodash/isError'
import _toString from 'lodash/toString'
import { withTranslation } from 'react-i18next'

import './style.css'

const debug = Debug('hfui:crash-screen')

class CrashHandler extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      appCrashed: false,
      crashStack: '',
    }
  }

  static getDerivedStateFromError(error) {
    return {
      crashStack: _isError(error) ? error.stack : _toString(error),
      appCrashed: true,
    }
  }

  componentDidCatch(error) {
    debug('The HFUI crashed: %s', error)
  }

  render() {
    const { appCrashed, crashStack } = this.state
    const { children, t } = this.props

    if (appCrashed) {
      return (
        <div className='hfui-crash_screen-wrapper'>
          <div className='hfui-crash_screen'>
            <h1>:(</h1>
            <h2>{t('crashHandler.text1')}</h2>
            <h4>
              {t('crashHandler.text2_1')}
              &nbsp;
              <a
                href='https://github.com/bitfinexcom/bfx-hf-ui/issues'
                target='_blank'
                rel='noopener noreferrer'
              >
                https://github.com/bitfinexcom/bfx-hf-ui/issues
              </a>
              ,&nbsp;
              <br />
              {t('crashHandler.text2_2')}
            </h4>
            <h5>
              {t('crashHandler.text3')}
              :
              <div className='hfui-crash_screen-crashstack'>{crashStack}</div>
            </h5>
          </div>
        </div>
      )
    }

    return children
  }
}

export default withTranslation()(CrashHandler)
