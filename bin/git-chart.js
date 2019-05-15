#! /usr/bin/env node

const program = require('commander')
const colors = require('colors')
const init = require('../lib/init')
const html = require('../lib/html')

program
  .version(require('../package.json').version)
  .usage('[命令] [参数]')

// 初始化配置
program
  .command('init')
  .description('Init config to current folder')
  .action((cmd) => {
    init.config()
  })

// 导出html
program
  .command('export')
  .description('export git stats to html')
  .option('-o, --out <folder>', 'the dir where to palce the output html files.', './git-chart-output')
  .action((cmd) => {
    html.generate(cmd)
  })

program.parse(process.argv)
