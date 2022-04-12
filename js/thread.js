const threadActions = {
  actions(){
    this.thread = [];
    this.caches = [];
    this.isRunningThread = false;
    this.currentThread = 0;
    this.currentInterval = 0;
    this.currentElement = false;
    this.loop = 0;
    this.time = 0;
    this.timeInterval = 0;
    this.runPage = false;
    
   
    this.callbackInterval = (task, comand, appName, appPackage) => {
      let isRunningTask = tasker.checkRunningTask(task)
      
      const maxNumberLoop = this.runPage == "uninstall" ? 25 : 15
      
      if( !isRunningTask || this.loop == maxNumberLoop ){
        
        const task_return = this.getHandleTaskerData("task_return")
        this.addHistoric(appName, appPackage, comand, task_return)
  
        if(task_return.includes("true")){ 
          this.taskActionsPerformed(task_return, comand, appName) 
          return
        }
      
        this.taskActionsNotPerformed(task_return, comand, appName)
        return
      }
      ++this.loop
    }
    this.addToThread = function({ task, comand, value, el, page }, array = appToolsData.data){
      const appName = array[value].name
      const appPackage = array[value].pakage
      
      this.thread.push( 
        async () => {
          this.loop = 0
          this.runPage = page
          this.currentElement = el
          this.saveTaskerData("task_return", "error", false)
          tasker.runTask(task, comand, appPackage)
          
          this.currentInterval = setInterval( () => 
            this.callbackInterval(task, comand, appName, appPackage)
          , 200 )
        }
      )
      if(!this.isRunningThread && this.thread.length) this.playThread(page)
    }
    this.playThread = function(page){
      this.isRunningThread = true
      this.time = 0
      this.caches = []
      this.runPage = page
      if(this.runPage != "home"){
        this.countTime()
        document.querySelector(`[data-${page}_details]`)
          .classList.add("hide")
        document.querySelector(`[data-${page}_card_details]`)
          .innerHTML += this.getHtmlDetails(page)
        this.btnStart.classList.add("running")
      }
      const func = this.thread[this.currentThread]
      if(func) func()
    }
    this.addHistoric = function(appName, appPackage, comand, task_return){
      appToolsData.historic.unshift( 
        { name: appName, pakage: appPackage, comand, task_return } 
      )
    }
    this.countTime = () => {
      this.timeInterval = setInterval( () => {
        ++this.time
        this.updateTimeNumber(this.runPage)
      },1000)
    }
    this.taskActionsPerformed = function(task_return, comand, appName){
      let sizeCache = 0
      if(comand.includes("clean")) {
       sizeCache = task_return.split("|")[1]
       task_return = "clean"
       if(this.runPage == "clean") this.caches.push(sizeCache)
      }
      if(comand.includes("kill")) task_return =  "kill"
      if(comand.includes("uninstall")) task_return =  "uninstall"
      
      const text = this.getStatusText(task_return, comand, appName, sizeCache)
      this.createMsg(text, true)
      this.checkThreadNext()
    }
    this.taskActionsNotPerformed = function(task_return, comand, appName){
      const text = this.getStatusText(task_return, comand, appName)
      this.createMsg(text, false)
      this.checkThreadNext()
    }
    this.getStatusText = function(task_return, comand, appName, sizeCache){
      const arrStatus = {
         kill: `<p><span>${appName}</span> encerrado</p>`,
         clean: `<p> Cache do <span>${appName}</span> limpo • ${sizeCache}</p>`,
         uninstall: `<p><span>${appName}</span> desinstalado</p>`,
         error: `<p>Erro ao ${ comand.includes("kill") ? "encerrar" : "limpar" } o aplicativo <span>${appName}</span></p>`,
         notCache: `<p><span>${appName}</span> não possui cache para limpar</p>`,
         notInstalled: `<p><span>${appName}</span> não está instalado. Atualize a lista de apps</p>`,
         cleanAll: `<p>Total de <span>${sizeCache}</span> de cache limpos...</p>`
      }
      const text = arrStatus[task_return]
      return text || "Não há menssagem definida para este comando"
    }
    this.checkThreadNext = async function(){
      clearInterval(this.currentInterval)
      this.currentElement.classList.remove("active")
      ++this.currentThread
      if(this.runPage != "home")this.updateProgressNumber(this.runPage)
      if(this.currentThread === this.thread.length){
        this.stopThread()
        return
      }
       const func = this.thread[this.currentThread]
       if(func) func()
    }
    this.stopThread = () => {
      clearInterval(this.timeInterval)
      if(this.runPage != "home"){
        clearInterval(this.currentInterval)
        document.querySelector(`[data-${this.runPage}_status]`).remove()
        document.querySelector(`[data-${this.runPage}_details]`)
          .classList.remove("hide")
        this.btnStart.classList.remove("running")
        this.thread = []
        this.currentThread = 0
      }
      if(this.runPage == "clean"){
        const totalCache = this.sumOfCaches(this.caches) || 0
        const text = this.getStatusText("cleanAll", "false", "false", totalCache)
        this.createMsg(text, true, true, true)
        this.addHistoric("false", "false", "cleanAll", `true|${totalCache}`)
      }
      this.caches = []
      this.time = 0
      this.isRunningThread = false
      this.updateHistoricNumber()
      this.renderRecents()
      this.saveAppsData()
    }
    
  }
}