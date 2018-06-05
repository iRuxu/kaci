const path = require("path");
const chalk = require('chalk');
const _symbols = require(path.join(__dirname,'include','symbols.js'));

module.exports = function (){
    let helpInfo = {
        'init' : '以默认方式初始化一个项目（gulp）',
        'init -g|--gulp' : '以gulp构建项目',
        'init -w|--webpack' : '以webpack构建项目',
        'start' : '启动本地服务，默认端口512',
        'start -p <n>' : '指定端口启动本地服务',
        'build' : '默认方式构建项目',
        'build <mode> [dir]' : '指定目录与模式构建项目',
    }
    for (var cname in helpInfo){
        console.log(chalk.cyanBright(_symbols.love + '  ' + cname + '  '),helpInfo[cname])
    }
}