/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react'
import Debug from 'debug'
import { useTranslation, Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { setUIValue } from '../../redux/actions/ui'
import { appVersion, ISSUES_REPORT_URL } from '../../redux/config'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import { ALLOWED_RC_VERSIONS } from '../../redux/reducers/ui'
import { getUIState } from '../../redux/selectors/ui'
import PanelIconButton from '../../ui/Panel/Panel.IconButton'

import './style.css'

const debug = Debug('hfui-rc-disclaimer')

const RCDisclaimer = () => {
  const { t } = useTranslation()
  const showRCDisclaimer = useSelector((state) => getUIState(state, UI_KEYS.isRCDisclaimerShown))

  const dispatch = useDispatch()

  const onClose = () => {
    try {
      const allowedRCVersionsJSON = localStorage.getItem(ALLOWED_RC_VERSIONS)
      const allowedRCVersions = allowedRCVersionsJSON
        ? JSON.parse(allowedRCVersionsJSON)
        : []

      const updatedAllowedRCVersionsJSON = JSON.stringify([
        ...allowedRCVersions,
        appVersion,
      ])
      localStorage.setItem(ALLOWED_RC_VERSIONS, updatedAllowedRCVersionsJSON)
    } catch (err) {
      debug('Error on saving allowed RC version to LS', err)
    }

    dispatch(setUIValue(UI_KEYS.isRCDisclaimerShown, false))
  }

  return (
    <CSSTransition
      in={showRCDisclaimer}
      timeout={300}
      classNames='hfui-rc-disclaimer__transition'
      appear
      unmountOnExit
    >
      <div className='hfui-rc-disclaimer'>
        <p className='hfui-rc-disclaimer__text'>
          <Trans
            t={t}
            i18nKey='RC_disclaimer.top'
            values={{
              appVersion,
            }}
            components={{
              url: (
                <a
                  className='hfui-rc-disclaimer__link'
                  href={ISSUES_REPORT_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </p>

        <PanelIconButton
          onClick={onClose}
          icon={<i className='icon-cancel' />}
        />
      </div>
    </CSSTransition>
  )
}

export default RCDisclaimer
