import React, {
  useMemo, useCallback, memo, useState,
} from 'react'
import _filter from 'lodash/filter'
import _includes from 'lodash/includes'
import _find from 'lodash/find'
import _toLower from 'lodash/toLower'
import _join from 'lodash/join'
import _map from 'lodash/map'
import ClassNames from 'classnames'
import PropTypes from 'prop-types'
import Dropdown from '../../ui/Dropdown'
import FavoriteIcon from '../../ui/Icons/FavoriteIcon'

import './style.css'
import { getPairFromMarket } from '../../util/market'

const MarketSelect = ({
  savePairs,
  authToken,
  favoritePairs = [],
  currentMode, value,
  onChange,
  markets,
  className,
  renderLabel,
  renderWithFavorites,
  getCurrencySymbol,
  ...otherProps
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const favoriteSelect = useCallback((pair, isPairSelected) => {
    if (isPairSelected) {
      savePairs([...favoritePairs, pair], authToken, currentMode)
    } else {
      const filteredPairs = _filter(favoritePairs, p => p !== pair)
      savePairs(filteredPairs, authToken, currentMode)
    }
  }, [savePairs, favoritePairs, authToken, currentMode])

  const sortedOptions = useMemo(() => {
    const filtered = searchTerm ? _filter(markets,
      (market) => {
        const { quote, base, ccyLabels = [] } = market
        const defaultLabels = [base, quote, base + quote, `${base}/${quote}`]
        const matches = _toLower(_join([...ccyLabels, ...defaultLabels]))
        return _includes(matches, _toLower(searchTerm))
      }, []) : markets
    const options = _map(filtered, (m => ({
      label: getPairFromMarket(m, getCurrencySymbol) || `${m.base}/${m.quote}`,
      value: m.uiID,
    })), [])
    return options.sort((a, b) => _includes(favoritePairs, b.value) - _includes(favoritePairs, a.value))
  }, [searchTerm, markets, getCurrencySymbol, favoritePairs])

  return (
    <Dropdown
      label={renderLabel ? 'Market' : undefined}
      searchable
      className={ClassNames('hfui-marketselect', className)}
      onChange={(val) => {
        onChange(_find(markets, m => m?.uiID === val))
      }}
      value={value.uiID}
      options={sortedOptions}
      onSearchTermChange={setSearchTerm}
      optionRenderer={renderWithFavorites ? (optionValue, optionLabel) => {
        const isSelected = _includes(favoritePairs, optionValue)
        return (
          <div className='hfui-marketselect__option'>
            <div className='hfui-marketselect__text'>{optionLabel}</div>
            <div
              className='hfui-marketselect__icon'
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                favoriteSelect(optionValue, !isSelected)
              }}
            >
              <FavoriteIcon
                value={optionValue}
                nonFilled={!isSelected}
                isSelected={isSelected}
                selectedColor='#F7F7F9'
              />
            </div>
          </div>
        )
      } : undefined}
      {...otherProps}
    />
  )
}

MarketSelect.propTypes = {
  value: PropTypes.instanceOf(Object).isRequired,
  onChange: PropTypes.func.isRequired,
  markets: PropTypes.objectOf(PropTypes.object).isRequired,
  renderLabel: PropTypes.bool,
  className: PropTypes.instanceOf(Object),
  currentMode: PropTypes.string,
  savePairs: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  favoritePairs: PropTypes.instanceOf(Array),
  renderWithFavorites: PropTypes.bool,
  getCurrencySymbol: PropTypes.func.isRequired,
}

MarketSelect.defaultProps = {
  className: {},
  favoritePairs: [],
  currentMode: '',
  renderLabel: false,
  renderWithFavorites: false,
}

export default memo(MarketSelect)
