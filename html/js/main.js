// 时间处理帮助函数
const timHelper = {
  // 获取秒时间戳
  toMs: function (time) {
    return parseInt(new Date(time).getTime() / 1000)
  }
}

// 过滤时间段
const dayPeriod = {
  all: function () {
    return []
  },
  // 昨天
  prevDay: function () {
    let from = moment().add(-1, 'days').format('YYYY-MM-DD 00:00:00')
    let to = moment().format('YYYY-MM-DD 00:00:00')
    return [timHelper.toMs(from), timHelper.toMs(to)]
  },

  // 本周
  thisWeek: function () {
    let today = (new Date()).getDay()
    let from = moment().add(1 - today, 'days').format('YYYY-MM-DD 00:00:00')
    return [timHelper.toMs(from)]
  },

  // 上周
  prevWeek: function () {
    let today = (new Date()).getDay()
    let from = moment().add(1 - 7 - today, 'days').format('YYYY-MM-DD 00:00:00')
    let to = moment().add(1 - today, 'days').format('YYYY-MM-DD 00:00:00')
    return [timHelper.toMs(from), timHelper.toMs(to)]
  },
  // 本月1号
  thisMonth: function () {
    let from = moment().format('YYYY-MM-01 00:00:00')
    return [timHelper.toMs(from)]
  },
  // 上月1号
  prevMonth: function () {
    let from = moment().add(-1, 'months').format('YYYY-MM-01 00:00:00')
    let to = moment().format('YYYY-MM-01 00:00:00')
    return [timHelper.toMs(from), timHelper.toMs(to)]
  }
}

new Vue({
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
        return item.time >= dayPeriod[this.startday]()
      }).reduce((result, item) => {
        result[item.author] = result[item.author] || {
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
