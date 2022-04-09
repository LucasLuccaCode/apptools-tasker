
const defaultTaskerData = { 
   type_apps: "user_full",
   days_week_execution: "", 
   exceptions: ""
}

let detailsActive = {
  home: false,
  kill: false,
  clean: false,
  uninstall: false,
}

const blackList = {
  kill: [
  "com.foxdebug.acode",
  "org.telegram.messenger",
  "com.whatsapp",
  "com.google.android.inputmethod.latin",
  "net.dinglisch.android.taskerm",
  "com.teslacoilsw.launcher",
  "com.fooview.android.fooview",
  "org.khr.llc"
  ],
  clean: [
  "com.google.android.inputmethod.latin",
  ],
  uninstall: [
  "net.dinglisch.android.taskerm",
  ]
}

const hourCheckDefault = {
  hour: "00:00",
  check: {
    status: false,
    Seg: false,
    Ter: false,
    Qua: false,
    Qui: false,
    Sex: false,
    Sab: true,
    Dom: false,
    kill: false,
    clean: true,
  }
}

const settingsDefault = {
  themeDark: true,
  vibration: true,
  recents: true,
  addSystemApps: false,
  activeLines: false,
  updateAppsAutomatically: false,
  reset: true,
}
  
let appToolsData = {
  exceptions: {kill: [...blackList.kill],clean: [...blackList.clean],uninstall: [...blackList.uninstall]},
  data: [],
  settings: { ...settingsDefault },
  historic: [],
  hourCheck: {
    hour: hourCheckDefault.hour,
    check: { ...hourCheckDefault.check }
  },
  packagesUninstall: ""
}