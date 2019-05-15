const readline = require('readline')
const colors = require('colors')

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

module.exports = {
  question: question,
  msg: msg
}
