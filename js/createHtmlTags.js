const createHtmlTags = {
  functions(){
    this.getHtmlCards = async function(array, page){
      let exceptions;
      let isExceptionCard = false
      this.orderCard = 0
      return array.map( ({ id, name, pakage, icon}, index) => {
        
      if(page != "home"){
         isExceptionCard = appToolsData.exceptions[page].includes(pakage)
      }
      
      return `
      <li data-${page}_card="${id}" 
      style="order:${ isExceptionCard ? --this.orderCard : 0 }" 
      class="c-page__card">
        <img data-cover="${id}" class="c-page__cover" onerror="appTools.coverError(this)" 
        src="${ icon ? icon : `content://net.dinglisch.android.taskerm.iconprovider//app/${pakage}` }" 
        loading="lazy" />
        <div class="c-page__content">
          <h2 class="nowrap">${name}</h2>
          <p class="nowrap">${pakage}</p>
        </div>
        
        ${page == "home" 
        ? `<ul class="c-page__kill_clean">
            <li data-home_kill="${id}" class="kill c--flex">
              <img src="${this.path}/src/tools/home_kill.png" loading="lazy" />
            </li>
            <li data-home_clean="${id}" class="clean c--flex">
              <img src="${this.path}/src/tools/home_clean.png" loading="lazy" />
            </li>
          </ul>`
        : `<input data-${page}_check="${id}" class="checkbox" type="checkbox" ${ !isExceptionCard ? "checked" : ""}>` }
      </li>
      `}).join("")
    }
    this.getHtmlHistoric = function(){
      const html = appToolsData.historic.map(
        ({ name, comand, task_return }) => {
          
          let sizeCache = 0
          
          if(task_return.includes("true")){ 
            if(comand.includes("clean")) {
             sizeCache = task_return.split("|")[1]
             task_return = comand == "cleanAll" ? "cleanAll" : "clean"
            }
            if(comand.includes("kill")) task_return =  "kill"
            if(comand.includes("uninstall")) task_return =  "uninstall"
          }

          const msg = this.getStatusText(task_return, comand, name, sizeCache)
          return `
          <li class="c-historic__card ${task_return == "kill" || task_return.includes("clean") || task_return == "uninstall" ? "sucess" : "error" }">
            ${msg}
          </li>
          `
          }).join("")
          
          return `
          <div class="c-historic__delete c--flex" data-home_deletehistoric>
            <img src="${this.path}/src/tools/delete.png">
            <p>Apagar historico</p>
          </div>
          ${html}`
    }
    this.getHtmlAutoExecution = function(){
      const check = appToolsData.hourCheck.check
      return `
        <section data-auto_execution
        class="c-auto_execution ${ check.status ? "active" : ""}">
          <div class="c-auto_execution__title">
            <h2>Execução Automática</h2>
            <input class="alternator" data-execution_check="status" type="checkbox" ${ check.status ? "checked"  : "" }>
          </div>
          <label class="c-auto_execution__hour" for="time">
            <input data-auto_execution="time" class="time" type="time" id="time">
            <div class="c--flex" for="time">
              <img src="${this.path}/src/tools/details_edit.png">
            </div>
            <h3> Horário definido
              <span data-hour_edit>${appToolsData.hourCheck.hour}</span>
            </h3>
          </label>
          <ul class="c-auto_execution__weeks">
          ${ ["Seg","Ter","Qua","Qui","Sex","Sab","Dom"].map( week => 
            `<li>
              <input id="${week}" data-week_check="${week}" type="checkbox" ${check[week] ? "checked"  : "" }>
              <label for="${week}" data-card_week="${week}">
                <p>${week}</p>
              </label>
            </li>`
          ).join("")}
          </ul>
          <div class="c-auto_execution__actions">
            <h3>AÇÕES</h3>
            <div>
              <label>
                <input data-actions_check="kill" type="checkbox" class="checkbox" ${check.kill ? "checked" : "" }>
                <p>Encerrar os aplicativos</p>
              </label>
              <label>
                <input data-actions_check="clean" type="checkbox" class="checkbox" ${check.clean ? "checked" : "" }>
                <p>Limpar o cache dos aplicativos</p>
              </label>
            </div>
          </div>
          
        </section>
      `
    }
    this.getBodyMsg = (text, status, isPermanent) => {
      const msg = document.createElement("li")
      msg.setAttribute("class", `${status ? "sucess" : "error" } c--flex`)
      msg.innerHTML = `
      <div class="c-msg__progress c--flex">
        ${ isPermanent ? "P" : "" }
      </div>
      <div class="c-msg__msg c--flex">
        ${text}
      </div>
      <div data-msg_cancel class="c-msg__cancel c--flex">
        <img src="${this.path}/src/tools/msg_cancel.png">
      </div>`
      return msg
    }
    this.getHtmlRecents = async array => {
      return array.map( ({ id, name, pakage, comand }, index ) => 
      `<li data-recents="${id}">
        <img src="content://net.dinglisch.android.taskerm.iconprovider//app/${pakage}" loading="lazy" />
        <p class="nowrap">${name}</p>
        <img src="${this.path}/src/tools/${ comand.includes("kill") ?  "home_kill" : "home_clean" }.png" loading="lazy" />
      </li>`).join("")
    }
    this.getHtmlDetails = page => {
      return `
      <ul class="c-page__details status" data-${page}_status>
        <li>
          <div>
            <img src="${this.path}/src/tools/details_time.png" alt="time" />
            <h2>TEMPO EXECUÇÃO</h2>
          </div>
          <span data-${page}_time>...</span>
        </li>
        <li>
          <div>
            <img src="${this.path}/src/tools/details_progress.png" alt="progress" />
            <h2>PROGRESSO</h2>
          </div>
          <span data-${page}_progress>...</span>
        </li>
        <li data-${page}_card_stop class="c-page__details_stop">
          <img class="stop" src="${this.path}/src/tools/details_stop.png" alt="stop" />
        </li>
      </ul>`
    }
  }
}