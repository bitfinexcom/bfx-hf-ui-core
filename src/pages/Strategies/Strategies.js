import React, {
  lazy, Suspense, useState, useCallback, useEffect,
} from 'react'
import Debug from 'debug'
import PropTypes from 'prop-types'
import randomColor from 'randomcolor'
import _ from 'lodash'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _every from 'lodash/every'
import _get from 'lodash/get'
import Indicators, { Indicator } from 'bfx-hf-indicators'
import { useTranslation } from 'react-i18next'
import { nonce } from 'bfx-api-node-util'
import HFS from 'bfx-hf-strategy'
import HFU from 'bfx-hf-util'
import Layout from '../../components/Layout'
import SaveUnsavedChangesModal from '../../modals/Strategy/SaveUnsavedChangesModal'
import RemoveExistingStrategyModal from '../../modals/Strategy/RemoveExistingStrategyModal'
import SaveStrategyAsModal from '../../modals/Strategy/SaveStrategyAsModal/SaveStrategyAsModal'
import { getDefaultStrategyOptions } from '../../components/StrategyEditor/StrategyEditor.helpers'
import useToggle from '../../hooks/useToggle'
import { STRATEGY_SHAPE } from '../../constants/prop-types-shapes'

import './style.css'

const debug = Debug('hfui-ui:p:strategy-editor')

const StrategyEditor = lazy(() => import('../../components/StrategyEditor'))
const StrategiesListTable = lazy(() => import('../../components/StrategiesListTable'),
)

const StrategiesPage = ({
  authToken,
  onSave,
  onRemove,
  strategy,
  setStrategy,
  strategyDirty,
  setStrategyDirty,
  isPaperTrading,
}) => {
  const [indicators, setIndicators] = useState([])
  const [sectionErrors, setSectionErrors] = useState({})

  const [
    isUnsavedStrategyModalOpen,,
    openUnsavedStrategyModal,
    closeUnsavedStrategyModal,
  ] = useToggle(false)
  const [isRemoveModalOpen, , openRemoveModal, closeRemoveModal] = useToggle(false)
  const [
    isSaveStrategyAsModalOpen,,
    openSaveStrategyAsModal,
    closeSaveStrategyAsModal,
  ] = useToggle(false)
  const [
    isRenameStrategyModalOpen,,
    openRenameStrategyModal,
    closeRenameStrategyModal,
  ] = useToggle(false)
  const [actionStrategy, setActionStrategy] = useState({})
  const [nextStrategyToOpen, setNextStrategyToOpen] = useState(null)
  const { t } = useTranslation()
  const strategyContent = _get(strategy, 'strategyContent', {})

  const onIndicatorsChange = useCallback((updatedIndicators) => {
    const newIndicators = _map(_values(updatedIndicators), (ind) => {
      let colors = []

      for (let i = 0; i < 5; i += 1) {
        colors.push(randomColor())
      }

      // allow users to overwrite colors
      if (ind.color) {
        colors[0] = ind.color
      } else if (ind.colors) {
        colors = ind.colors; // eslint-disable-line
      }

      return [ind.constructor, ind._args, colors]
    })

    setIndicators(newIndicators)
  }, [])

  const setSectionError = useCallback(
    (section, error) => {
      setSectionErrors({
        ...sectionErrors,
        [section]: error,
      })
    },
    [sectionErrors],
  )

  const clearSectionError = useCallback(
    (section) => {
      setSectionError(section, '')
    },
    [setSectionError],
  )

  const processSectionError = useCallback(
    (section, e) => {
      if (e.lineNumber && e.columnNumber) {
        // currently it's a non-standard property supported by Firefox only :(
        setSectionError(
          section,
          `Line ${e.lineNumber}:${e.columnNumber}: ${e.message}`,
        )
      } else {
        setSectionError(section, e.message)
      }
    },
    [setSectionError],
  )

  const evalSectionContent = useCallback(
    (section, providedContent) => {
      const content = providedContent || strategy[section] || ''

      try {
        if (section === 'defineIndicators') {
          const func = eval(content); // eslint-disable-line
          const definedIndicators = func(Indicators)
          const areIndicatorsCorrect = !_isEmpty(definedIndicators)
            && _every(definedIndicators, (i) => i instanceof Indicator)
          if (!areIndicatorsCorrect) {
            throw new Error(t('strategyEditor.noIndicators'))
          }
          clearSectionError(section)
          return func
        }
        if (section.substring(0, 6) === 'define') {
          const func = eval(content); // eslint-disable-line
          clearSectionError(section)
          return func
        }
        if (section.substring(0, 2) === 'on') {
          const func = eval(content)({ HFS, HFU, _ }); // eslint-disable-line
          clearSectionError(section)
          return func
        }
        debug('unrecognised section handler prefix: %s', section)
        return null
      } catch (e) {
        processSectionError(section, e)
        return null
      }
    },
    [clearSectionError, processSectionError, t, strategy],
  )

  const onDefineIndicatorsChange = useCallback(
    (content) => {
      const indicatorFunc = evalSectionContent('defineIndicators', content)
      let strategyIndicators = {}

      if (indicatorFunc) {
        try {
          strategyIndicators = indicatorFunc(Indicators)
        } catch (e) {
          processSectionError('defineIndicators', e)
        }
      }

      _forEach(_values(strategyIndicators), (i) => {
        i.key = `${nonce()}`; // eslint-disable-line
      })

      onIndicatorsChange(strategyIndicators)
    },
    [evalSectionContent, onIndicatorsChange, processSectionError],
  )

  const processIndicators = useCallback((content) => {
    if (!_isEmpty(content.defineIndicators)) {
      onDefineIndicatorsChange(content.defineIndicators)
    } else {
      // reset indicators state if strategy does not have own indicators
      processSectionError(
        'defineIndicators',
        new Error(t('strategyEditor.noIndicators')),
      )
      setIndicators([])
    }
  }, [onDefineIndicatorsChange, processSectionError, t])

  const onLoadStrategy = useCallback(
    (newStrategy, forcedLoad = false) => {
      const strategyToLoad = { ...newStrategy }
      if (isPaperTrading && strategyDirty && !forcedLoad) {
        setNextStrategyToOpen(strategyToLoad)
        openUnsavedStrategyModal()
        return
      }
      if (
        !_isEmpty(strategyToLoad)
        && _isEmpty(strategyToLoad.strategyOptions)
      ) {
        strategyToLoad.strategyOptions = getDefaultStrategyOptions()
      }
      setStrategy(strategyToLoad)
      setSectionErrors({})
      setNextStrategyToOpen(null)
      setStrategyDirty(false)
    },
    [
      isPaperTrading,
      strategyDirty,
      setStrategy,
      setStrategyDirty,
      openUnsavedStrategyModal,
    ],
  )

  const saveStrategy = useCallback(
    (content) => {
      onSave(authToken, { ...content, savedTs: Date.now() })
    },
    [authToken, onSave],
  )

  const onCloseModals = useCallback(() => {
    setActionStrategy({})
    closeRemoveModal()
    closeSaveStrategyAsModal()
    closeRenameStrategyModal()
    closeUnsavedStrategyModal()
  }, [
    closeRemoveModal,
    closeRenameStrategyModal,
    closeSaveStrategyAsModal,
    closeUnsavedStrategyModal,
  ])

  const removeStrategy = useCallback(() => {
    const { id } = actionStrategy
    onRemove(authToken, id)
    onCloseModals()
  }, [actionStrategy, authToken, onCloseModals, onRemove])

  const saveAsStrategy = useCallback(
    (updatedStrategy) => {
      onSave(authToken, { ...updatedStrategy, savedTs: Date.now() })
      onCloseModals()
    },
    [authToken, onCloseModals, onSave],
  )

  const renameStrategy = useCallback(
    ({ label }) => {
      onSave(authToken, { ...actionStrategy, label, savedTs: Date.now() })
      onCloseModals()
    },
    [actionStrategy, authToken, onCloseModals, onSave],
  )

  const saveAsHandler = useCallback(
    (rowData) => {
      setActionStrategy(rowData)
      openSaveStrategyAsModal()
    },
    [openSaveStrategyAsModal],
  )

  const renameStrategyHandler = useCallback(
    (rowData) => {
      setActionStrategy(rowData)
      openRenameStrategyModal()
    },
    [openRenameStrategyModal],
  )

  const strategyRemoveHandler = useCallback(
    (rowData) => {
      setActionStrategy(rowData)
      openRemoveModal()
    },
    [openRemoveModal],
  )

  useEffect(() => {
    if (_isEmpty(strategyContent)) {
      return
    }
    processIndicators(strategyContent)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyContent])

  return (
    <Layout>
      <Layout.Header />
      <Layout.Main flex className='hfui-strategyeditorpage1'>
        <Suspense fallback={<></>}>
          <StrategyEditor
            dark
            key='editor'
            onIndicatorsChange={onIndicatorsChange}
            onLoadStrategy={onLoadStrategy}
            strategyDirty={strategyDirty}
            setStrategyDirty={setStrategyDirty}
            sectionErrors={sectionErrors}
            strategy={strategy}
            setStrategy={setStrategy}
            setSectionErrors={setSectionErrors}
            onDefineIndicatorsChange={onDefineIndicatorsChange}
            evalSectionContent={evalSectionContent}
            saveStrategy={saveStrategy}
            moveable={false}
            indicators={indicators}
            removeable={false}
          />
        </Suspense>
        <StrategiesListTable
          onLoadStrategy={onLoadStrategy}
          onStrategyRemove={strategyRemoveHandler}
          saveAsHandler={saveAsHandler}
          renameStrategy={renameStrategyHandler}
        />
        <SaveUnsavedChangesModal
          isOpen={isUnsavedStrategyModalOpen}
          onClose={onCloseModals}
          strategy={strategy}
          nextStrategy={nextStrategyToOpen}
          onLoadStrategy={onLoadStrategy}
          saveStrategy={saveStrategy}
        />
        <SaveStrategyAsModal
          isOpen={isSaveStrategyAsModalOpen}
          onClose={onCloseModals}
          strategy={actionStrategy}
          onSubmit={saveAsStrategy}
        />
        <SaveStrategyAsModal
          isOpen={isRenameStrategyModalOpen}
          onClose={onCloseModals}
          strategy={actionStrategy}
          onSubmit={renameStrategy}
        />
        <RemoveExistingStrategyModal
          isOpen={isRemoveModalOpen}
          onClose={onCloseModals}
          onRemoveStrategy={removeStrategy}
          strategy={actionStrategy}
        />
      </Layout.Main>
      <Layout.Footer />
    </Layout>
  )
}

StrategiesPage.propTypes = {
  setStrategy: PropTypes.func.isRequired,
  strategy: PropTypes.shape(STRATEGY_SHAPE).isRequired,
  authToken: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  strategyDirty: PropTypes.bool.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  setStrategyDirty: PropTypes.func.isRequired,
}

StrategiesPage.defaultProps = {}

export default StrategiesPage
