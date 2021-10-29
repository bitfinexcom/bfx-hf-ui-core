import React, { memo, useMemo } from 'react'
import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const EmptyContent = ({
  strategies,
  onOpen,
  openCreateNewStrategyModal,
  openSelectExistingStrategyModal,
}) => {
  const { t } = useTranslation()

  const strategyNodesArray = useMemo(() => {
    return _map(strategies, (strategy, index) => {
      if (index >= 6) {
        return null
      }
      return (
        <li
          key={strategy.id}
          className='strategy-item'
          onClick={() => onOpen(strategy)}
        >
          {strategy.label}
        </li>
      )
    })
  }, [strategies, onOpen])
  return (
    <>
      {_isEmpty(strategies) ? (
        <div className='hfui-strategyeditor__without-strategies'>
          <div>
            <p className='button' onClick={openCreateNewStrategyModal}>
              {t('strategyEditor.createStrategyStringPart1')}
            </p>
            <p>{t('strategyEditor.createStrategyStringPart2')}</p>
          </div>
        </div>
      ) : (
        <div className='hfui-strategyeditor__empty-content'>
          <p className='recent-title'>
            {t('strategyEditor.recent')}
            :
          </p>
          <ul className='strategies-list'>{strategyNodesArray}</ul>
          {strategyNodesArray.length >= 7 && (
            <p
              className='strategy-item'
              onClick={openSelectExistingStrategyModal}
            >
              {t('strategyEditor.more')}
              ...
            </p>
          )}
        </div>
      )}
    </>
  )
}

EmptyContent.propTypes = {
  strategies: PropTypes.arrayOf(PropTypes.object).isRequired,
  openCreateNewStrategyModal: PropTypes.func.isRequired,
  openSelectExistingStrategyModal: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
}

export default memo(EmptyContent)
