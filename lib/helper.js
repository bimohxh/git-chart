const readline = require('readline')
const colors = require('colors')
const fs = require('fs')
const path = require('path')

// 输入提问中断
function question (questionCon) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question((questionCon), (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

// 打印消息
function msg (msg, type) {
  colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    success: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  })

  type = type || 'info'
  console.log(colors[type](msg))
}

// 复制目录 /www/app/css/main/   /www/output
function copyDir (from, dir, dist) {
  let list = fs.readdirSync(dir)
  let distFolder = dir.replace(from, dist)
  if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder)
  }

  list.forEach((file) => {
    let _file = dir + '/' + file
    var stat = fs.statSync(_file)
    if (stat.isDirectory()) {
      copyDir(from, _file, dist)
    } else {
      let distPath = distFolder + '/' + file
      fs.writeFileSync(distPath, fs.readFileSync(_file))
    }
  })
}

module.exports = {
  question: question,
  msg: msg,
  copyDir: copyDir
}
