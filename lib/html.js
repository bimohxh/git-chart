// 导出html
const git = require('./git')

function generate (cmd) {
   git.revList()
}

module.exports = {
  generate: generate
}
