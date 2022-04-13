const selectorsAndEvents = {
  selectors(){
    this.c_order = document.querySelector("[data-order]");
    this.title = document.querySelector("[data-title]");
    this.c_msg = document.querySelector(".c-msg");
    this.formSearch = document.querySelector("[data-header_form]");
    this.search = document.querySelector("[data-header_search]");
    this.searchBack = document.querySelector("[data-search_back]");
    this.c_shortcuts = document.querySelector("[data-header_shortcuts]");
    this.homeShortcut = document.querySelector("[data-header_shortcut='home']");
    this.killShortcut = document.querySelector("[data-header_shortcut='kill']");
    this.c_main = document.querySelector("[data-main_pages]");
    this.c_blur = document.querySelector("[data-blur]");
    this.pages = document.querySelectorAll("[data-page]")
    this.pagesContent = document.querySelectorAll("[data-page_content]")
    this.pageHome = document.querySelector("[data-page='home']")
    this.homeRecents = document.querySelector("[data-home_recents]")
    this.homeContent = document.querySelector("[data-page_content='home']")
    this.pageKill = document.querySelector("[data-page='kill']")
    this.pageKillDetails = document.querySelector("[data-kill_card_details]")
    this.pageClean = document.querySelector("[data-page='clean']")
    this.pageCleanDetails = document.querySelector("[data-clean_card_details]")
    this.pageUninstall = document.querySelector("[data-page='uninstall']")
    this.pageUninstallDetails = document.querySelector("[data-uninstall_card_details]")
    this.pageSettings = document.querySelector("[data-page='settings']")
    this.btnStart = document.querySelector("[data-footer_card='start']")
    this.c_footer = document.querySelector("[data-footer]");
  },
  events(){
    this.optionsObserver = {
      root: this.c_main,
      rootMargin: "3px",
      threshold: .3
    }
    this.c_order.addEventListener("click", this.orderActions)
    this.c_blur.addEventListener("click", this.removeBlur)
    this.c_msg.addEventListener("click", this.removeMsg)
    this.formSearch.addEventListener("submit", this.searchApp)
    this.searchBack.addEventListener("click", this.resetSearchField)
    this.search.addEventListener("input", this.debounce(this.searchApp, 400))
    this.c_shortcuts.addEventListener("click", this.scrollToPage)
    this.observerPages = new IntersectionObserver(this.callbackObserver
    , this.optionsObserver)
    this.pageHome.addEventListener("click", this.homeActions)
    this.homeRecents.addEventListener("click", this.recentsActions)
    this.homeContent.addEventListener("change", this.toggleAutoExecutionCheck)
    this.pageSettings.addEventListener("change", this.settingsActions)
    this.pages.forEach( page => this.observerPages.observe( page ) )
    this.pageKill.addEventListener("change", this.toggleCheckbox)
    this.pageKillDetails.addEventListener("click", this.detailsActions)
    this.pageClean.addEventListener("change", this.toggleCheckbox)
    this.pageCleanDetails.addEventListener("click", this.detailsActions)
    this.pageUninstall.addEventListener("change", this.toggleCheckbox)
    this.pageUninstallDetails.addEventListener("click", this.detailsActions)
    this.c_footer.addEventListener("click", this.footerActions)
    this.c_main.addEventListener("touchstart", this.touchStart)
    this.c_main.addEventListener("touchmove", this.debounce(this.touchMoveEnd, 40) )
  }
}



