const formatting = {
  functions() {
    this.convertCaches = cache => {
      const {
        0: letter
      } = cache.match(/[A-Z]/);
      let sizeCache = Number(cache.replace(letter, ""));

      const cacheConversionTable = {
        B: () => sizeCache / 1000000,
        K: () => sizeCache / 1000,
        M: () => sizeCache,
        G: () => sizeCache * 1000,
      }
      const func = cacheConversionTable[letter]
      return func ? func() : cache
    }
    this.secondToMinutes = function(s) {
      const min = `0${ (s - (s %= 60)) / 60 }`.slice(-2)
      const sec = `0${s}`.slice(-2)
      return `${min}:${sec}`
    }
    this.converterToDayWeek = function() {
      const tableConversion = {
        Seg: "segunda-feira|Monday",
        Ter: "terça-feira|Tuesday",
        Qua: "quarta-feira|Wednesday",
        Qui: "quinta-feira|Thursday",
        Sex: "sexta-feira|Friday",
        Sab: "sabado|Saturday",
        Dom: "domingo|Sunday",
      }

      const newDaysWeek = []
      const daysWeek = appToolsData.hourCheck.check
      for (let week in daysWeek) {
        if (daysWeek[week] && week != "status")
          newDaysWeek.push(tableConversion[week] || week)
      }
      return newDaysWeek
    }
    //retornar o aplicativo com maior cache
    this.maiorCache = function(array) {
      return cachesConvertidos.reduce((acc, {
        name, cache
      }) => acc.cache > cache ? acc: {
        name, cache
      }, {
        name: "acode", cache: 2
      })
    }
    //retornar soma dos caches
    this.sumOfCaches = function(array) {
      return array.reduce((totalCaches, cache) =>
        totalCaches += this.convertCaches(cache),
        0).toFixed(2) + " MB"
    }
    //retornar array com nomes em ordem crescente
    this.alphabeticOrder = function() {
      appToolsData.data = [...appToolsData.data].sort((app1, app2) =>
        app1.name.toLowerCase() > app2.name.toLowerCase() ? +1: -1)
      .map((item, index) => ({
        ...item, id: index
      }))
    }
    //retornar array com nomes em ordem decrescente
    this.reverseAlphabeticOrder = function() {
      appToolsData.data = [...appToolsData.data].sort((app1, app2) => app2.name.toLowerCase() > app1.name.toLowerCase() ? +1: -1).map((item, index) => ({
        ...item, id: index
      }))
    }
  }
}