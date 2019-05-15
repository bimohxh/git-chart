// 时间处理帮助函数
const timeHelper = {
  all: function () {
    return 0
  },
  // 昨天
  prevDay: function () {
    let yesterday = moment().add(-1, 'days').format('YYYY-MM-DD 00:00:00')
    return parseInt( new Date(yesterday).getTime() / 1000)
  },

  // 本周周一
  thisWeek: function () {
    let today = (new Date()).getDay()
    let monday = moment().add(1- today, 'days').format('YYYY-MM-DD 00:00:00')
    return parseInt( new Date(monday).getTime() / 1000)
  },

  // 上周周一
  prevWeek: function () {
    let today = (new Date()).getDay()
    let monday = moment().add(1 - 7 - today, 'days').format('YYYY-MM-DD 00:00:00')
    return parseInt( new Date(monday).getTime() / 1000)
  },
  // 本月1号
  thisMonth: function () {
    let month = moment().format('YYYY-MM-01 00:00:00')
    return parseInt(new Date(month).getTime() / 1000)
  },
  // 上月1号
  prevMonth: function () {
    let month = moment().add(-1, 'months').format('YYYY-MM-01 00:00:00')
    return parseInt(new Date(month).getTime() / 1000)
  }
}


var app = new Vue({
  el: '#app',
  data: {
    gitdata: window.JSONDATA,
    view: 'author',
    views: [
      {
        key: 'author',
        name: '开发者'
      }, {
        key: 'codes',
        name: '代码量'
      }
    ],
    daylist: {
      prevDay: '昨天',
      thisWeek: '本周',
      prevWeek: '上周',
      thisMonth: '本月',
      prevMonth: '上月',
      all: '全部'
    },
    startday: 'all'// 从哪天开始（时间戳）

  },
  computed: {
    authors: function () {
      let data = this.gitdata.filter(item => {
       return item.time >= timeHelper[this.startday]()
      }).reduce((result, item) => {
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
  methods: {
  },
  created () {
  }
})