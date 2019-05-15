var app = new Vue({
  el: '#app',
  data: {
    gitdata: window.JSONDATA
  },
  computed: {
    authors: function () {
      let data = this.gitdata.reduce((result, item) => {
        result[item.author] =  result[item.author] || {
          commits: 0,
          '+lines': 0,
          '-lines': 0
        }
        result[item.author].commits += 1
        result[item.author]['+lines'] += item['+lines']
        result[item.author]['-lines'] += item['-lines']
        return result
      }, {})
      let arr = []
      for (var key in data) {
        arr.push({
          name: key,
          commits: data[key].commits,
          '+lines': data[key]['+lines'],
          '-lines': data[key]['-lines']
        })
      }
      arr.sort((a, b) => {
        return b.commits - a.commits
      })
      return arr
    }
  },
  created () {
  }
})