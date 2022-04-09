
const appTools = {
  path: tasker.path,
  numberRecents: 10,
  getContexts(){
    updates.functions.call(this)
    createHtmlTags.functions.call(this)
    selectorsAndEvents.selectors.call(this)
    threadActions.actions.call(this)
    formatting.functions.call(this)
    callbacks.functions.call(this)
    ultilities.functions.call(this)
    selectorsAndEvents.events.call(this)
  },
  async start(){
    const thereSavedData = this.checkSavedData()
    if(thereSavedData) this.assignSaveData()
    if(!thereSavedData) this.monitorFullAppsListing()
    this.renderRecents()
    this.updatePages(["home","kill","clean","uninstall"])
    this.updateHistoricNumber()
    this.updateHour()
    this.updateCheckboxSettings()
    this.checkNewApps()
  }
}
appTools.getContexts()