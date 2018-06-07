const shell = require('shelljs');
const chalk = require("chalk");
const symbols = require("./include/symbols.js");
let __tip = chalk.yellowBright

module.exports = {

    //gulp模式
    gulp: function(mode) {
        console.log(__tip(`${symbols.flower}\0\0build : 进入gulp构建模式..`))

        //默认使用production模式
        mode == undefined ? mode = 'production' : mode

        //执行gulp build任务
        mode == 'production' ? 
        shell.exec(`gulp build`) : 
        shell.exec(`gulp ${mode}`)
    }
    
}