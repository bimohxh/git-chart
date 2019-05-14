const readline = require('readline')

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

module.exports = {
  question: question
}
