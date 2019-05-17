const helper = require('./lib/helper')
const path = require('path')

helper.copyDir(path.resolve(__dirname, './html'), path.resolve(__dirname, './html'), path.resolve(__dirname, './test-out'))