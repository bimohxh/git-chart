// 初始化相关工作
const fs = require('fs')
const path = require('path')
const helper = require('./helper')

module.exports = {
  // 默认创建配置文件
  config: async function () {
    let filePath = path.resolve(process.cwd(), './git-chart.config.json')
    if (fs.existsSync(filePath)) {
      let answer = await helper.question('the config file has exist, replace it?(n) ')
      if (answer !== 'y') {
        return
      }
    }
    const configJson = {
      repos: [
        {
          name: path.basename(process.cwd()),
          path: './',
          branch: 'master'
        }
      ]
    }
    fs.writeFileSync(filePath, JSON.stringify(configJson, null, 2), 'utf8')
    console.log('file git-chart.config.json has been created in current foleder.\nyou can edit it to fit you custom configuration.')
  }
}
