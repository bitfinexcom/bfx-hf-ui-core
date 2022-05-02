import _isNumber from 'lodash/isNumber'
import _isEmpty from 'lodash/isEmpty'

export const getTabTitle = (tab) => {
  // eslint-disable-line
  const { htmlKey, tabtitle, sbtitle } = tab.props

  if (typeof sbtitle === 'string') {
    return sbtitle
  }

  if (typeof tabtitle === 'string') {
    return tabtitle
  }

  if (!htmlKey) {
    console.trace('htmlKey missing')
  }

  return htmlKey
}

// eslint-disable-next-line consistent-return
export const getForcedTab = (forcedTab, tabs) => {
  if (_isNumber(forcedTab)) {
    return forcedTab
  }

  if (_isEmpty(forcedTab)) {
    return 0
  }

  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].props.tabtitle === forcedTab) {
      return i
    }
  }
}
