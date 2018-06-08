const path = require("path");
const chalk = require("chalk");
const symbols = require("./include/symbols.js");

let __echo = chalk.cyanBright;

module.exports = function() {
    let helpInfo = {
        "init" : "初始化项目(默认模式gulp)",
        "init -m|--<mode>": "以指定模式构建项目",
        "start": "启动本地服务，默认端口512",
        "start -p|--port <n>": "指定一个本地服务端口",
        "build": "默认方式构建项目",
        "build -m|--mode <mode>": "按指定方案构建项目(<mode>为kaci.config.js中build的key)"
    };
    for (var cname in helpInfo) {
        console.log(
            __echo(`${symbols.love} \0 ${cname} \t\t ${helpInfo[cname]}`)
        );
    }
};
