import React, { memo } from 'react'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Button from '../Button'
import './style.css'

const PanelSettings = ({
  title, content, onClose,
}) => {
  const { t } = useTranslation()
  return (
    <div className='hfui-panelsettings__wrapper'>
      {title || (
        <p className='header'>
          {t('appSettings.title')}
        </p>
      )}
      {content && (
        <div className={ClassNames('inner')}>{content}</div>
      )}

      <div className='footer'>
        <Button
          label={t('ui.closeBtn')}
          onClick={onClose}
        />
      </div>
    </div>
  )
}

PanelSettings.propTypes = {
  title: PropTypes.string,
  content: PropTypes.node.isRequired,
  onClose: PropTypes.func,
}

PanelSettings.defaultProps = {
  title: null,
  onClose: () => { },
}

export default memo(PanelSettings)
