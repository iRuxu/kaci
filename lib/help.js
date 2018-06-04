const path = require("path");
const chalk = require('chalk');
const _symbols = require(path.join(__dirname,'const.js'));
let log = console.log

module.exports = function (){
    let helpInfo = {
        'init' : '初始化（默认方式）',
        'init -g|--gulp' : '以gulp构建项目',
        'init -w|--webpack' : '以webpack构建项目',
        'start' : '启动本地服务，默认端口512',
        'start -p <n>' : '指定端口启动本地服务',
        'server' : '启动本地服务，默认端口512',
        'server -p <n>' : '指定端口启动本地服务',
        'build' : '本地构建项目',
        'build -o|--local <dir>' : '指定目录本地构建项目',
        'build -t|--preview <dir>' : '指定目录构建测试项目',
        'build -e|--production <dir>' : '指定目录构建线上项目',
    }
    for (var cname in helpInfo){
        log(chalk.cyanBright(_symbols.love + '  ' + cname + '  '),helpInfo[cname])
    }
}