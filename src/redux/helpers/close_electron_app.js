const closeElectronApp = () => {
  if (window.electronAPI) {
    window.electronAPI.sendAppClosedEvent()
  }
}

export default closeElectronApp
