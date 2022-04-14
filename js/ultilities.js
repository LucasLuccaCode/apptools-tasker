const ultilities = {
  functions(){
    this.order_msg = 0
    this.sleep = function(ms) {
      return new Promise( resolve => setTimeout( resolve, ms ))
    }
    this.checkSavedData = function(){
      return localStorage.hasOwnProperty("appToolsData")
    }
    this.assignSaveData = function(){
      appToolsData = JSON.parse(localStorage.getItem("appToolsData"))
    }
    this.monitorFullAppsListing = function(){
      this.c_blur.classList.add("active")
      this.scrollToPage({target: this.homeShortcut})
      
      let taskerData = this.getHandleTaskerData("data", true)
      
      taskerData.type_apps = appToolsData.settings["addSystemApps"] 
        ? `system_full` : `user_full`
      this.saveTaskerData("data", taskerData, true)
      
      const task = "APPT 5 - LIST APPS"
      tasker.runTask(task)
      
      const interval = setInterval(()=>{
        let isRunningTask = tasker.checkRunningTask(task)
        if(!isRunningTask) {
          const task_return = this.getHandleTaskerData("task_return", false)
          clearInterval(interval);
          this.updateUpdatedAppsData(task_return);
          this.saveAppsData();
          this.updatePages(["home","kill","clean","uninstall"]);
          this.createMsg(this.getTexts("updatedApps"), true);
          this.checkNewApps()
          detailsActive = { home: false, kill: false,  clean: false, uninstall: false }
          
          this.saveTaskerData("task_return", "false", false)
        }
      }, 200)
      
    }
    this.checkNewApps = async () => {
      const currentAmount = appToolsData.data.length;
      const btnUpdate = document.querySelector("[data-footer_card='update']");
      
      if(tasker.qtd_apps == currentAmount){
        btnUpdate.classList.remove("update")
        return 
      }
        
      if(appToolsData.settings.updateAppsAutomatically){
        this.monitorFullAppsListing()
        return
      }
      btnUpdate.classList.add("update");
      const text = this.getTexts("checkNewApps")
      this.createMsg(text, true, true, true)
    }
    this.createMsg = async (text, status, isLongTime, isPermanent) => {
      --this.order_msg
      const msg = this.getBodyMsg(text, status, isPermanent)
      const c_progress = msg.querySelector("div")
      this.c_msg.appendChild(msg)
      msg.classList.add("active")
      if(isPermanent) return
      
      let n = isLongTime ? 12 : 8
      await this.sleep(30)
      const interval = setInterval( ()=> {
        c_progress.innerText = --n
        if(n == 0) {
          msg.remove()
          clearInterval(interval)
        }
      },1000)
      
      msg.setAttribute("data-msg_card", interval)
      
    }
    this.debounce = (func, wait, immediate) => {
      let timeout;
      return function(...args) {
        const context = this;
        const later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      }
    }
    this.getDataSetAttributes = function(el){
      const data = el.dataset
      const key = Object.keys(data)[0]
      const value = data[key]
      return { data, key, value }
    }
    this.getPackagesUninstall = function(){
      return appToolsData.data.filter( ({ pakage }) => appToolsData.packagesUninstall.includes(pakage))
    }
    this.activateDevTools = function(){
      var script = document.createElement('script'); 
      script.src = "//cdn.jsdelivr.net/npm/eruda"; 
      document.body.appendChild(script); 
      script.onload = function () {
        eruda.init()
      }
    }
    this.getHandleTaskerData = function(name, isJson){
      const data = tasker.getLocal(name)
      return isJson ? JSON.parse(data) : data
    }
    this.saveTaskerData = function(name, data, isJson){
      data = isJson ? JSON.stringify(data, null, 2) : data
      tasker.setLocalVar(name, data)
    }
    this.saveAppsData = function(){
      localStorage.setItem("appToolsData", 
        JSON.stringify(appToolsData))
    }
    this.removeStorageData = function(){
      localStorage.removeItem("appToolsData")
      const text = this.getTexts("removeStorageData")
      this.createMsg(text, true)
    }
    this.toggleExceptions = (value, el) => {
      const arr_exceptions = appToolsData.exceptions[this.currentPage]
      const packageApp = appToolsData.data[value].pakage
      const existException = arr_exceptions.includes(packageApp)
      if(existException) arr_exceptions.splice(arr_exceptions.indexOf(packageApp),1)
      if(!existException) arr_exceptions.unshift(packageApp)
      
      if("selecteds|exceptions".includes(detailsActive[this.currentPage])) el.parentNode.remove()
      
      const taskerData = this.getHandleTaskerData("data", true)
      taskerData.exceptions = `${appToolsData.exceptions.kill}-MR-${appToolsData.exceptions.clean}`
      this.saveTaskerData("data", taskerData, true)
    }
    this.createFile = function(content, nameFile){
      const code = `#!/bin/bash;
        path="${this.path}/${nameFile}.txt";
        rm "$path";
        echo "${content}" >> "$path";`
      tasker.actionsShell(code)
    }
    this.resetSelectedsDetails = function(page){
      const cards = document.querySelectorAll(`[data-${page}_card_details] li`);
        [...cards].forEach( card => card.classList.remove("active"))
    }
    this.getExceptions = function(page){
      const exceptions = appToolsData.exceptions[page]
      const data = page == "uninstall" ? this.getPackagesUninstall() : appToolsData.data
      return data.filter( ({pakage}) => exceptions.includes(pakage))
    }
    this.getSelecteds = function(page){
      const exceptions = appToolsData.exceptions[page]
      const data = page == "uninstall" ? this.getPackagesUninstall() : appToolsData.data
      return data.filter( ({pakage}) => !exceptions.includes(pakage))
    }
    this.getFiltereds = function(value){
      return appToolsData.data.filter( ({name, pakage}) =>  [name, pakage].some( item => item.toUpperCase().includes(value)))
    }
    this.renderRecents = async () => {
      if(!appToolsData.settings.recents){ 
        this.homeRecents.innerHTML = ""
        return
      }
      const recents = []
      for(let i=0; recents.length < this.numberRecents; i++){
        if(i == appToolsData.historic.length) break
        const { name, pakage, comand } = appToolsData.historic[i]
        if(recents.some( item => item.name === name && item.comand == comand ) || comand == "cleanAll" ) continue
        recents.push({ id: i, name, pakage, comand })
      }
      
      this.homeRecents.innerHTML = await this.getHtmlRecents(recents)
    }
    this.renderFilteredsCards = async (value) => {
      const page = this.currentPage
      const filtereds = this.getFiltereds(value)
      document.querySelector(`[data-page_content="${page}"]`)
        .innerHTML = await this.getHtmlCards( filtereds, page )
      return filtereds.length
    }
    this.renderTotalCards = async () => {
      const page = this.currentPage
      const total = page == "uninstall" ? this.getPackagesUninstall() : appToolsData.data
      document.querySelector(`[data-page_content="${page}"]`)
        .innerHTML = await this.getHtmlCards( total, page )
    }
    this.renderSelectedsCards = async () => {
      const page = this.currentPage
      const selecteds = this.getSelecteds(page)
      document.querySelector(`[data-page_content="${page}"]`)
        .innerHTML = await this.getHtmlCards( selecteds, page )
    }
    this.renderExceptionsCards = async() => {
      const page = this.currentPage
      const noSelecteds = this.getExceptions(page)
      document.querySelector(`[data-page_content="${page}"]`)
        .innerHTML = await this.getHtmlCards( noSelecteds, page )
    }
    this.deleteHistoric = () => {
      appToolsData.historic = []
      this.saveAppsData()
      this.updateHistoricNumber()
      this.renderHistoric()
      this.renderRecents()
      this.createMsg(this.getTexts("deleteHistoric"), true);
    }
    this.renderHistoric = () => {
      document.querySelector(`[data-page_content="home"]`)
        .innerHTML = this.getHtmlHistoric()
    }
    this.renderAutoExecution = () => {
      document.querySelector(`[data-page_content="home"]`)
        .innerHTML = this.getHtmlAutoExecution()
    }
    this.getTexts = function(value, boolean){
      const texts = {
        updatedApps: () => `<p>${appToolsData.settings["addSystemApps"] ? " <span>Aplicativos do sistema</span> adicionados ": " Lista de aplicativos <span>atualizada</span>" }</p>`,
        checkNewApps: () => `<p>Lista de aplicativos desatualizada, clique no botão de <span>Atualizar</span> no menu abaixo, para atualizar a lista de aplicativos.</p>`,
        removeStorageData: () => `<p>Dados do aplicativo resetados...</p>`,
        noDefined: () => `<p>Ainda não foram adicionadas ações para este botão, <span>novidades na próxima atualização</span>...</p>`,
        autoExecution: () => `<p>Execução automática <span>${boolean ? "ativada" : "desativada" }</span><p>`,
        editHour: () => `<p>Execução automática definida para às <span>${boolean}</span><p>`,
        deleteHistoric: () => `<p>Dados do <span>Histórico</span> apagados</p>`
        
      }
      const func = texts[value]
      if(func) return func()
    }
  }
}