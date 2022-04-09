const callbacks = {
  functions(){
    this.currentPage = "home"
    this.lastShortcut = false
    this.observerPages = false
    this.tapShortucut = false
    this.timeout = 0
    this.lastScroll = 0
    this.orderCard = 0
    
    this.removeBlur = () => {
      this.c_blur.classList.remove("active")
    }
    this.coverError = async (el) => {
      const value = el.getAttribute("data-cover")
      const img = `${this.path}/src/tools/system.png`
      el.src = img
      appToolsData.data[value].icon = img
      this.saveAppsData()
    }
    this.resetSearchField = async () => {
      this.search.value = ""
      this.searchBack.classList.add("hide")
      
      this.renderTotalCards()
      this.updateTotalNumber(this.currentPage)
    }
    this.orderActions = ({ target: el }) => {
      const { key, value } = this.getDataSetAttributes(el)
      if(key == "order") this.c_order.classList.remove("active")
      if(!value) return
      const data = appToolsData.data
      const actions = {
        alphabetic: () => {
          this.alphabeticOrder(data)
        },
        reverseAlphabetic: () => {
          this.reverseAlphabeticOrder(data)
        },
      }
      const func = actions[value]
      if(func){
        const loader = document.querySelector(".c-order__loader")
        loader.classList.add("active")
        setTimeout( () => {
          func()
          this.updatePages(["home","kill","clean", "uninstall"])
          this.saveAppsData()
          loader.classList.remove("active")
        }, 250)
      }
      console.log(value)
    }
    this.searchApp = async (e) => {
      if(this.currentPage == "settings") return
      e.preventDefault()
      const value = this.search.value.trim().toUpperCase()
      if(value != "") this.searchBack.classList.remove("hide")
      
      const filteredsNumber = await this.renderFilteredsCards(value)
      if(value == "") {
        this.searchBack.classList.add("hide")
        this.updateTotalNumber(this.currentPage)
        return
      }
      this.updateTotalNumber(this.currentPage, filteredsNumber, true)
    }
    this.scrollToPage = ({ target: el }) => {
      const { value } = this.getDataSetAttributes(el)
      if(!value) return
      const page = document.querySelector(`[data-page="${value}"]`)
      const to = page.offsetLeft
      this.tapShortucut = true
      
      if( el === this.lastShortcut ){
        page.querySelector("[data-page_content]").scroll(0, 0)
        return
      }
      this.c_main.scroll(to, 0)
      this.activateCurrentShortcut(el)
      clearTimeout(this.timeout)
      this.timeout = setTimeout( 
        () => this.tapShortucut = false, 1000 )
    }
    this.activateCurrentShortcut = (el) => {
      const { key, value } = this.getDataSetAttributes(el)
      const titles = {
        home: "App Tools",
        kill: "Encerrar aplicativos",
        clean: "Limpar caches",
        uninstall: "Desinstalar Apps",
        settings: "Configurações",
      }
      this.title.textContent = titles[value]
      const shortcut = document.querySelector(`[data-header_shortcut="${value}"]`)
      if(this.lastShortcut) 
        this.lastShortcut.classList.remove("active")
      if(shortcut){
        shortcut.classList.add("active")
      }
      this.lastShortcut = shortcut || false
      this.currentPage = value
    }
    this.callbackObserver = (entries, observer) => { 
      entries.forEach( 
      ({isIntersecting, intersectionRatio, target: el }) => {
        const elementoVisivel = isIntersecting === true || intersectionRatio > 1;
        
        if (elementoVisivel && !this.tapShortucut )
          this.activateCurrentShortcut(el)
          if(this.currentPage == "home" || this.currentPage == "settings") {
            this.btnStart.classList.add("disabled")
          } else {
            this.btnStart.classList.remove("disabled")
          }
      })
    }
    this.removeMsg = ({ target: el }) => {
      const { key } = this.getDataSetAttributes(el)
      if(key != "msg_cancel") return 
      const card = el.parentNode
      const { value } = this.getDataSetAttributes(card)
      if(value) clearInterval(value)
      setTimeout( () => card.remove(), 250)
    }
    this.recentsActions = ({ target: el }) => {
      const { key, value } = this.getDataSetAttributes(el)
      if(!value && key != "recents") return
      
      const currentHistoric = appToolsData.historic[value]
      el.classList.add("active")
      const hasActiveVibration = appToolsData.settings["vibration"]
      if(hasActiveVibration) window.navigator.vibrate(11)
      
      const parameters = { 
        task: "APPT 6 - ACTIONS",
        comand: currentHistoric.comand,
        value,
        time: 3000,
        el,
        page: this.currentPage
      }
      this.addToThread(parameters, appToolsData.historic)
    }
    this.homeActions = async ({ target: el }) => {
      const { key, value } = this.getDataSetAttributes(el)
      if(!key || !key.includes("home")) return
      if(key === "home_kill" || key === "home_clean") {
        el.classList.add("active")
        const hasActiveVibration = appToolsData.settings["vibration"]
        if(hasActiveVibration) window.navigator.vibrate(11)
        const parameters = { 
          task: "APPT 6 - ACTIONS",
          comand: key,
          value,
          time: 3000,
          el,
          page: this.currentPage
        }
        this.addToThread(parameters)
        return
      }
      this.detailsActions({ target: el })
    }
    this.detailsActions = async ({ target: el }) => {
      const { key } = this.getDataSetAttributes(el)
      const value = key.split("_").pop()
      
      const actions = {
        total: this.renderTotalCards,
        selecteds: this.renderSelectedsCards,
        exceptions: this.renderExceptionsCards,
        historic: this.renderHistoric,
        deletehistoric: this.deleteHistoric,
        execution: this.renderAutoExecution,
        stop: this.stopThread,
      }
      const func = actions[value]
      if(func) {
        if(value != "stop" ){ 
          this.resetSelectedsDetails(this.currentPage)
          detailsActive[this.currentPage] = value
        }
        el.classList.add("active")
        setTimeout( () => {
          func()
          document.querySelector(`[data-page_content="${this.currentPage}"]`).scroll(0,0)
          if(value == "stop") el.classList.remove("active")
        }, 50 )
      }
    }
    this.settingsActions = ({ target: el }) => {
      const hasActiveVibration = appToolsData.settings["vibration"]
      if(hasActiveVibration) window.navigator.vibrate(12)
      const value = el.getAttribute("data-settings_check")
      appToolsData.settings[value] = el.checked;
      this.saveAppsData()
      const settings = {
        
        themeDark: ()=>{},
        addSystemApps: () => {
          this.c_blur.classList.add("active")
          this.scrollToPage({target: this.homeShortcut})
          this.monitorFullAppsListing()
        },
        recents: () => {
          this.renderRecents()
        },
        activeLines: ()=>{
          document.body.style.setProperty('--size-lines-spacing', `${appToolsData.settings["activeLines"] ? ".2vh" : "0vh"}`);
        },
        updateAppsAutomatically: ()=>{},
        reset: ()=>{
          this.removeStorageData()
          this.scrollToPage({target: this.homeShortcut})
          appToolsData.settings = { ...settingsDefault }
          appToolsData.exceptions = {
            kill: [...blackList.kill],
            clean: [...blackList.clean],
            uninstall: [...blackList.uninstall]
          }
          appToolsData.historic = []
          appToolsData.hourCheck = { 
            hour: hourCheckDefault.hour,
            check: { ...hourCheckDefault.check }
          }
          detailsActive = { home: false, kill: false,  clean: false, uninstall: false }
          
          this.saveTaskerData("data", {...defaultTaskerData}, true)
          this.saveTaskerData("task_return", false, false)
          this.saveTaskerData("hour_execution", "00:00", false)
          tasker.toggleProfile("APPT 0 - AUTO EXECUTION", false)
          
          this.updateHour()
          this.updateHistoricNumber()
          this.updateCheckboxSettings()
          this.renderRecents()
          this.monitorFullAppsListing()
        },
      }
      const func = settings[value]
      if(func) func()
    }
    this.footerActions = ({ target: el }) => {
      const { value } = this.getDataSetAttributes(el)
      if(!value) return
      const actions = {
        search: this.debounce( () => {
          this.search.focus()
        }, 250 ),
        update: this.debounce( () => {
          this.monitorFullAppsListing()
        }, 250),
        start: this.debounce( () => {
          this.thread = []
          this.currentThread = 0
          const page = this.currentPage
          const validPage = ["kill","clean","uninstall"].some( item => item == page);
          if(!validPage) return
          const checkeds = document.querySelectorAll(`[data-${page}_check]:checked`);
          
          [...checkeds].forEach( el => {
            const { key ,value } = this.getDataSetAttributes(el)
      
            const parameters = { 
              task: "APPT 6 - ACTIONS",
              comand: key,
              value,
              time: 3000,
              el,
              page
            }
            this.addToThread(parameters)
          })
        }, 250),
        settings: this.debounce(() => { 
          const el = document.createElement("li")
          el.setAttribute("data-header_shortcut", "settings")
          this.scrollToPage({target: el })
        }, 250),
        order: this.debounce(() => {
          this.c_order.classList.add("active")
        }, 50),
      }
      const func = actions[value]
      if(func) func()
    }
    this.toggleAutoExecutionCheck = ({ target: el }) => {
      const { key, value } = this.getDataSetAttributes(el)
      if(!value) return
      const hasActiveVibration = appToolsData.settings["vibration"]
      if(hasActiveVibration) window.navigator.vibrate(10)
      appToolsData.hourCheck.check[value] = el.checked
      
      if(["Seg","Ter","Qua","Qui","Sex","Sab","Dom","kill","clean"].includes(value) || value == "status"){
        const weeks = this.converterToDayWeek().join("\n")
        
        const taskerData = this.getHandleTaskerData("data", true)
        taskerData.days_week_execution = weeks
        taskerData.exceptions =  `${appToolsData.exceptions.kill}-MR-${appToolsData.exceptions.clean}`
        this.saveTaskerData("data", taskerData, true)
      }
      
      const actions = {
        status: () => {
          el.parentNode.parentNode.classList.toggle("active")
          tasker.toggleProfile("APPT 0 - AUTO EXECUTION", el.checked)
          const hour = appToolsData.hourCheck.hour
          
          this.saveTaskerData("hour_execution", 
            hour.replace(":","."), false)
          
          this.updateHour()
          const text = this.getTexts("autoExecution",el.checked)
          this.createMsg(text, true)
        },
        time: () => {
          if(!el.value) return
          appToolsData.hourCheck.hour = el.value
          
          this.saveTaskerData("hour_execution", 
            el.value.replace(":","."), false)
            
          this.updateHour()
          const text = this.getTexts("editHour", el.value)
          this.createMsg(text, true)
        }
      }
      const func = actions[value]
      if(func) func()
      
      this.saveAppsData()
    }
    this.toggleCheckbox = (e) => {
      const hasActiveVibration = appToolsData.settings["vibration"]
      if(hasActiveVibration) window.navigator.vibrate(12)
      const { target: el } = e
      const { value } = this.getDataSetAttributes(el)
  
      const card = document.querySelector(`[data-${this.currentPage}_card="${value}"]`);
      
      setTimeout( () => { 
        card.style.order = !el.checked ? --this.orderCard : 0
        this.toggleExceptions(value, el)
        this.saveAppsData()
        this.updateSelectedsNumber(this.currentPage)
        this.updateExceptionsNumber(this.currentPage)
      }, 200)
    }
  }
}