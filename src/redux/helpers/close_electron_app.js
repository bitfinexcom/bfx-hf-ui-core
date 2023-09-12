const closeElectronApp = () => {
  if (window.electronService) {
    window.electronService.sendAppClosedEvent()
  }
}

export default closeElectronApp
