const updates = {
  functions(){
    this.updateCheckboxSettings = async function(){
      const settingsCheckbox = document.querySelectorAll("[data-settings_check]");
      
      settingsCheckbox.forEach( checkElement => {
        const { value } = this.getDataSetAttributes(checkElement)
        checkElement.checked = appToolsData.settings[value]
      })
      document.body.style.setProperty('--size-lines-spacing', `${appToolsData.settings["activeLines"] ? ".2vh" : "0vh"}`)
    }
    this.updateUpdatedAppsData = function(data){
      let [ appsName, appsPackage, appsUninstall] = data.split("-MR-")
      appsName = appsName.split("|")
      appsPackage = appsPackage.split("|")
      appToolsData.packagesUninstall = appsUninstall
      tasker.qtd_apps = appsName.length;

      appToolsData.data = appsName.map((name, i) => 
        ({
          id: i,
          name,
          pakage: appsPackage[i],
        })
      )
      this.alphabeticOrder()
    }
    this.updatePages = async function(pages){
      const arrDataPromises = []
     
      pages.forEach( page => {
        const data = page == "uninstall" ? this.getPackagesUninstall() : appToolsData.data
        arrDataPromises.push( this.getHtmlCards(data, page ) )
      })
      Promise.all(arrDataPromises)
      .then( htmlCodes => {
        pages.forEach( (page, index) => {
          const currentHtmlData = htmlCodes[index]
          document.querySelector(`[data-page_content="${page}"]`)
            .innerHTML = currentHtmlData;
          this.updateTotalNumber(page)
          if(page != "home"){
            this.updateSelectedsNumber(page)
            this.updateExceptionsNumber(page)
          }
        })
      })
      
      this.c_blur.classList.remove("active")
    }
    this.updateHour = function(){
      const elemHourDetails = 
        document.querySelector(`[data-home_hour]`);
      const elemHourEdit = 
        document.querySelector(`[data-hour_edit]`);
      const isActiveExecution = appToolsData.hourCheck.check.status; 

      if(elemHourEdit) elemHourEdit.textContent = appToolsData.hourCheck.hour
      if(isActiveExecution){
        elemHourDetails.textContent = appToolsData.hourCheck.hour
        elemHourDetails.classList.remove("exceptions")
        return
      }
      elemHourDetails.textContent = "Off"
      elemHourDetails.classList.add("exceptions")
    }
    this.updateHistoricNumber = function(){
      if(appToolsData.historic.length > 200){
        appToolsData.historic = appToolsData.historic.slice(0, this.maxHistoric)
        this.saveAppsData()
      }
      document.querySelector(`[data-home_historic]`)
      .textContent = appToolsData.historic.length;
    }
    this.updateTotalNumber = function(page, total, isSearch){
      if(total != 0 && !total) total = appToolsData.data.length
      if(isSearch) total = total == 1 ? `${total} resultado` : `${total} resultados`
      if(page == "uninstall") total = this.getPackagesUninstall().length
      document.querySelector(`[data-${page}_total]`).textContent = total
    }
    this.updateSelectedsNumber = function(page){
      const selecteds = this.getSelecteds(page)
      document.querySelector(`[data-${page}_selecteds]`)
      .textContent = selecteds.length
    }
    this.updateExceptionsNumber = function(page){
      const exceptions = this.getExceptions(page)
      document.querySelector(`[data-${page}_exceptions]`)
        .textContent = exceptions.length
    }
    this.updateTimeNumber = function(page){
      const time = this.time
      document.querySelector(`[data-${page}_time]`)
        .textContent = this.secondToMinutes(time)
    }
    this.updateProgressNumber = function(page){
      const current = this.currentThread
      const total = this.thread.length
      document.querySelector(`[data-${page}_progress]`)
        .textContent = `${current} / ${total}`
    }
  }
}