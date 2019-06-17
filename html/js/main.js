const moment = window.moment
const echarts = window.echarts

// 时间处理帮助函数
const timHelper = {
  // 获取秒时间戳
  toMs: function (time) {
    return parseInt(new Date(time + ' 00:00:00').getTime() / 1000)
  }
}

// 过滤时间段
const dayPeriod = {
  all: function () {
    let startDay = moment(window.JSONDATA[window.JSONDATA.length - 1].time * 1000).format('YYYY-MM-DD')
    return [startDay]
    // return [timHelper.toMs(startDay)]
  },
  // 昨天
  prevDay: function () {
    let from = moment().add(-1, 'days').format('YYYY-MM-DD')
    let to = moment().format('YYYY-MM-DD 00:00:00')
    return [from, to]
  },

  // 本周
  thisWeek: function () {
    let today = (new Date()).getDay()
    let from = moment().add(1 - today, 'days').format('YYYY-MM-DD')
    return [from]
  },

  // 上周
  prevWeek: function () {
    let today = (new Date()).getDay()
    let from = moment().add(1 - 7 - today, 'days').format('YYYY-MM-DD')
    let to = moment().add(1 - today, 'days').format('YYYY-MM-DD')
    return [from, to]
  },
  // 本月1号
  thisMonth: function () {
    let from = moment().format('YYYY-MM-01')
    return [from]
  },
  // 上月1号
  prevMonth: function () {
    let from = moment().add(-1, 'months').format('YYYY-MM-01')
    let to = moment().format('YYYY-MM-01')
    return [from, to]
  },
  // 今年
  thisYear: function () {
    let from = moment().format('YYYY-01-01')
    return [from]
  }
}

// 折线图
const drawLine = function (xAxis, yAxis) {
  let myChart = echarts.init(document.getElementById('echart-codes'))
  let option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: yAxis,
      type: 'line',
      areaStyle: {}
    }]
  }
  myChart.setOption(option)
}

new Vue({
  el: '#app',
  data: {
    gitdata: window.JSONDATA,
    datepicker: null,
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
    startday: 'all', // 从哪天开始（时间戳）
    startAt: '',
    endAt: '',
    codeChart: {
      lineViews: {
        day: {
          name: '日',
          format: 'YYYY-MM-DD'
        },
        month: {
          name: '月',
          format: 'YYYY-MM'
        },
        year: {
          name: '年',
          format: 'YYYY'
        }
      },
      activeLineView: 'day',
      timePeriods: {
        thisWeek: {
          name: '本周'
        },
        thisMonth: {
          name: '本月'
        },
        thisYear: {
          name: '今年'
        },
        all: {
          name: '全部'
        }
      },
      activeTime: 'thisMonth',
      dataTypes: {
        lines: {
          name: '累计代码行数'
        },
        commit: {
          name: '累计提交数'
        }
      },
      activeType: 'commit',
      activeAuthor: null,
      showAuthors: false
    },
    sortby: ['lines', 'desc'],
    fields: [
      {
        name: '开发者',
        key: 'name'
      }, {
        name: '提交数',
        sort: true,
        key: 'commits'
      }, {
        name: '新增代码行数',
        sort: true,
        key: '+lines'
      }, {
        name: '删除代码行数',
        sort: true,
        key: '-lines'
      }, {
        name: '总代码行数',
        sort: true,
        key: 'lines'
      }
    ]
  },
  computed: {
    authors: function () {
      $('#date1').datepicker('update', this.startAt)
      $('#date2').datepicker('update', this.endAt)
      $('.date-range').datepicker('update')

      let startTime = timHelper.toMs(this.startAt)
      let endTime = timHelper.toMs(this.endAt)
      let data = this.gitdata.filter(item => {
        return item.time >= startTime && (endTime ? item.time < endTime : true)
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
          '-lines': data[key]['-lines'],
          lines: data[key]['+lines'] - data[key]['-lines']
        })
      }

      arr.sort((a, b) => {
        return this.sortby[1] === 'asc' ? (a[this.sortby[0]] - b[this.sortby[0]]) : (b[this.sortby[0]] - a[this.sortby[0]])
      })
      return arr
    }
  },
  methods: {
    switchMenu: function (key) {
      this.view = key
      if (this.view === 'codes') {
        Vue.nextTick(() => {
          this.drawChartCodes()
        })
      }
    },

    // 列表排序
    sortdata: function (field, type) {
      this.sortby = [field.key, type]
    },

    // 代码量折线图
    drawChartCodes: function () {
      let viewFormat = this.codeChart.lineViews[this.codeChart.activeLineView].format // 'YYYY-MM'  // 视图类型
      let startDay = timHelper.toMs(dayPeriod[this.codeChart.activeTime]()[0]) // '2016-02-01' // 开始于哪一天
      let diffView = {
        'YYYY-MM-DD': 'days',
        'YYYY-MM': 'months',
        'YYYY': 'years'
      }

      let totalNum = 0
      let _gitdata = this.gitdata.filter(item => {
        return item.time >= startDay
      })

      // 过滤作者
      if (this.codeChart.activeAuthor) {
        _gitdata = this.gitdata.filter(item => item.author === this.codeChart.activeAuthor)
      }

      // 拿到所有数据
      let result = {}
      for (let i = _gitdata.length - 1; i >= 0; i--) {
        let item = _gitdata[i]
        let day = moment(item.time * 1000).format(viewFormat)
        if (this.codeChart.activeType === 'lines') {
          totalNum += item['+lines']
        } else {
          totalNum += 1
        }
        result[day] = totalNum
      }
      // 视图
      let datas = {}
      startDay = moment(startDay * 1000).format(viewFormat)
      let endDay = moment().format(viewFormat)
      let startVal = 0

      while (startDay !== endDay) {
        datas[startDay] = result[startDay] || startVal
        startVal = datas[startDay]
        startDay = moment(startDay).add(1, diffView[viewFormat]).format(viewFormat)
      }

      drawLine(Object.keys(datas), Object.values(datas))
    },

    // 设置折线图视图
    setLineView: function (lineView) {
      this.codeChart.activeLineView = lineView
      this.drawChartCodes()
    },
    setTimePeriod: function (time) {
      this.codeChart.activeTime = time
      this.drawChartCodes()
    },
    setDataType: function (type) {
      this.codeChart.activeType = type
      this.drawChartCodes()
    },
    setLineAuthor: function (author) {
      this.codeChart.activeAuthor = author
      this.drawChartCodes()
    },

    // 修改时间段
    changeRange: function (key) {
      this.startday = key
      let _period = dayPeriod[this.startday]()
      this.startAt = _period[0]
      this.endAt = _period[1] || moment().format('YYYY-MM-DD')
    }
  },
  mounted () {
    let _self = this
    this.datepicker = $('.date-range').datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true,
      language: 'zh-CN',
      inputs: $('.range')
    }).on('changeDate', function (e) {
      let date = e.format('yyyy-mm-dd')
      if (e.target.id === 'date1') {
        _self.startAt = date
      }
      if (e.target.id === 'date2') {
        _self.endAt = date
      }
    })

    this.changeRange('thisMonth')
  }
})
