const shell = require('shelljs');
const chalk = require("chalk");
const symbols = require("./include/symbols.js");
let __tip = chalk.yellowBright

module.exports = {

    //gulp模式
    gulp: function(port) {
        console.log(__tip(`${symbols.flower}\0\0start : 启动本地服务..`))
        //默认使用512端口
        port==undefined ? port = 512 : port = port
        
        //执行gulp start任务
        let startcmd = 'gulp start --' + port
        shell.exec(startcmd)
    }
    
}