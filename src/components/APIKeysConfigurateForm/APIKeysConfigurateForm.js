import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Scrollbars from '../../ui/Scrollbars'
import NavbarLink from '../Navbar/Navbar.Link'
import { getIsPaperTrading } from '../../redux/selectors/ui'
import './style.scss'

const CREATE_API_KEYS_URL = 'https://setting.bitfinex.com/api#new-key'
const CREATE_BFX_ACCOUNT_URL = 'https://www.bitfinex.com/sign-up'
const CREATE_SUB_ACCOUNT_URL = 'https://setting.bitfinex.com/subaccounts'
const LEARN_MORE_PAPER_URL = 'https://support.bitfinex.com/hc/en-us/articles/900001525006-Paper-Trading-at-Bitfinex-test-learn-and-simulate-trading-strategies'

const APIKeysConfigurateForm = ({
  content, icon, title, form, buttons, onClick, titleColor, apiClientConnecting, showDescription,
}) => {
  const { t } = useTranslation()
  const isPaperTrading = useSelector(getIsPaperTrading)

  return (
    <div className='hfui-apikeys-configurate-form__wrapper'>
      <div className='hfui-apikeys-configurate-form'>
        <Scrollbars>
          <div
            role='button'
            tabIndex={0}
            className='inner-container'
            onClick={onClick}
          >
            {icon && (<i className={icon} />)}
            {title && (
              <p
                style={!titleColor ? {} : {
                  color: titleColor,
                }}
              >
                {title}
              </p>
            )}

            {content && (content)}

            {form && (
              <div className='hfui-apikeys-configurate-form__modal-form'>
                {form}
              </div>
            )}

            {buttons && (
              <div className='hfui-apikeys-configurate-form__modal-buttons'>
                {buttons}
              </div>
            )}

            {showDescription && !isPaperTrading && (
              <div className='hfui-apikeys-configurate-form__modal-description'>
                {t('appSettings.noApiKeys')}
                <NavbarLink className='link' external={CREATE_API_KEYS_URL} label={t('appSettings.createAPI')} />
                <br />
                {t('appSettings.noBfxAccount')}
                <NavbarLink className='link' external={CREATE_BFX_ACCOUNT_URL} label={t('appSettings.clickToSignup')} />
              </div>
            )}

            {showDescription && isPaperTrading && (
              <div className='hfui-apikeys-configurate-form__modal-description'>
                {t('appSettings.noApiKeysPaper')}
                <NavbarLink className='link' external={LEARN_MORE_PAPER_URL} label={t('appSettings.learnMoreHere')} />
                <br />
                {t('appSettings.noBfxAccountPaper')}
                <NavbarLink className='link' external={CREATE_SUB_ACCOUNT_URL} label={t('appSettings.createASubAcc')} />
              </div>
            )}

            {apiClientConnecting && (
              <span>
                {t('orderForm.exchangeConnecting')}
              </span>
            )}
          </div>
        </Scrollbars>
      </div>
    </div>
  )
}

APIKeysConfigurateForm.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.node, PropTypes.arrayOf(PropTypes.node), PropTypes.string,
  ]),
  icon: PropTypes.string,
  title: PropTypes.string,
  form: PropTypes.oneOfType([
    PropTypes.node, PropTypes.arrayOf(PropTypes.node),
  ]),
  buttons: PropTypes.oneOfType([
    PropTypes.node, PropTypes.arrayOf(PropTypes.node),
  ]),
  onClick: PropTypes.func,
  apiClientConnecting: PropTypes.bool,
  titleColor: PropTypes.string,
  showDescription: PropTypes.bool,
}

APIKeysConfigurateForm.defaultProps = {
  apiClientConnecting: false,
  titleColor: '',
  onClick: () => { },
  title: '',
  icon: '',
  content: null,
  form: null,
  buttons: null,
  showDescription: false,
}

export default memo(APIKeysConfigurateForm)
