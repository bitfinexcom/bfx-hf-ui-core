import React from 'react'
import { useInjectBfxData } from '@ufx-ui/bfx-containers'
import { StoreProvider as UfxStoreProvider } from '@ufx-ui/core'
import { useSelector } from 'react-redux'
import useAuthToken from '../../hooks/useAuthToken'
import HFUI from '../HFUI'
import CrashHandler from '../CrashHandler'
import { getCurrentLanguage } from '../../redux/selectors/ui'

const HFUIWrapper = () => {
  useInjectBfxData()
  useAuthToken()
  const language = useSelector(getCurrentLanguage)

  const timezoneOffset = -(new Date().getTimezoneOffset())
  const config = {
    timezoneOffset,
    lang: language,
  }

  return (
    <UfxStoreProvider value={config}>
      <CrashHandler>
        <HFUI />
      </CrashHandler>
    </UfxStoreProvider>
  )
}

export default HFUIWrapper
