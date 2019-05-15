// 导出html
const git = require('./git')

function generate (cmd) {
  git.revList(cmd.out)
}

module.exports = {
  generate: generate
}
