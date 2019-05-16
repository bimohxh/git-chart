// git 相关操作命令
const { exec } = require('child_process')
const tty = process.platform === 'win32' ? 'CON' : '/dev/tty'
const fs = require('fs')
const path = require('path')
const helper = require('./helper')

// 获取所有开发者新增和删除代码的行数
async function getLines () {
  return new Promise(resolve => {
    exec(`git log --shortstat  -m  --pretty=format:"%at %aN"   < ${tty}`, {
      cwd: process.cwd(),
      maxBuffer: 5000 * 1024
    }, (err, stdout) => {
      if (err) {
        console.error(err)
        resolve(null)
      } else {
        let result
        let resultArr = []
        let patt = /(\d+)\s(.+)\s+(\d+)\sfiles?\schanged(,\s(\d+)\sinsertions?\(\+\))?(,\s(\d+)\sdeletions?\(\-\))?/g
        while ((result = patt.exec(stdout)) !== null)  {
          // 取 4 和 6 的位置
          let addLines = 0
          let delLines = 0
          ;[4, 6].forEach(index => {
            if (result[index]) {
              addLines += result[index].includes('+') ? parseInt(result[index + 1]) : 0
              delLines += result[index].includes('-') ? parseInt(result[index + 1]) : 0
            }
          })
          
          resultArr.push({
            'time': parseInt(result[1]),
            'author': result[2],
            '+lines': parseInt(addLines),
            '-lines': parseInt(delLines)
          })
        }
        
      resultArr.sort((a, b) => {
        return b.time - a.time
      })
        resolve(resultArr)
      }
    })
  })
}

// 导出所有git记录
async function revList (out) {
  helper.msg('> start get stats by git log...', 'verbose')
  let lines = await getLines()
  helper.msg('get stats success! ', 'success')
  helper.msg('> start write file...', 'verbose')
  fs.writeFileSync(path.resolve(__dirname, '../html/js/gitdata.js'), `window.JSONDATA = ${JSON.stringify(lines, null, 2)}`, 'utf8')
  helper.msg('write file success!', 'success')
  helper.msg('> start copy html...', 'verbose')
  let disFolder = path.resolve(process.cwd(), out)
  // 复制 html 目录
  exec(`cp -r ${path.resolve(__dirname, '../html')} ${out}`, (err, stdout) => {
    if (err) {
      console.error(err)
    } else {
      helper.msg('success generate html!', 'success')
    }
  })
}

module.exports = {
  revList: revList
}
