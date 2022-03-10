import React, { memo } from 'react'
import _map from 'lodash/map'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import './style.css'

const OrderFormMenu = ({ atomicOrderTypes, algoOrderTypes, onSelect }) => {
  const { t } = useTranslation()
  return (
    <div className='hfui-orderformmenu__wrapper'>
      <h4>{t('atomicOrdersTableModal.title')}</h4>
      <ul>
        {_map(atomicOrderTypes, type => (
          <li key={type.label} onClick={() => onSelect(type)}>
            <i className={`icon-${type.uiIcon}`} />
            <div>{type.label}</div>
          </li>
        ))}
      </ul>

      <h4>{t('AOTableModal.titleFull')}</h4>
      <ul>
        {_map(algoOrderTypes, type => (
          <li key={type.label} onClick={() => onSelect(type)}>
            <i className={`icon-${type.uiIcon}`} />
            <div>
              <p>{type.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

OrderFormMenu.propTypes = {
  atomicOrderTypes: PropTypes.arrayOf(PropTypes.objectOf([
    PropTypes.string,
  ])).isRequired,
  algoOrderTypes: PropTypes.arrayOf(PropTypes.objectOf([
    PropTypes.string,
  ])).isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default memo(OrderFormMenu)
