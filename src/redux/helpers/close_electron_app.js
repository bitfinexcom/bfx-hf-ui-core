import { saveLastSessionTimestamp } from '../../util/ui'

const closeElectronApp = () => {
  if (window.electronService) {
    saveLastSessionTimestamp()
    window.electronService.sendAppClosedEvent()
  }
}

export default closeElectronApp
