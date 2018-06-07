const shell = require('shelljs');
const chalk = require("chalk");
const symbols = require("./include/symbols.js");
let __tip = chalk.yellowBright

module.exports = {

    //gulp模式
    gulp: function(mode) {
        console.log(__tip(`${symbols.flower}\0\0build : 开始打包项目..`))
        //默认使用production方案
        mode==undefined ? mode = 'production' : mode = mode
        
        //执行gulp build任务
        let buildcmd = 'gulp build --' + mode
        shell.exec(buildcmd)
    }
    
}