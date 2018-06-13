const path = require("path");
const tool = require("./include/tool");
const echo = require("./utils/echo");

module.exports = function() {
    let helpInfo = {
        "\0\0":"---------------help----------------",
        "init" : "\t\t\t\0初始化项目",
        "init -t|--tool <name>": "\t\0指定目标工具并初始化项目",
        "<name>": `\t\t\t\0支持的工具列表：[${tool}]`,
        "\0":" ",
        "start": "\t\t\t\0启动本地服务(默认端口512)",
        "start -p|--port <n>": "\t\0指定一个端口启动本地服务",
        "\t":" ",
        "build": "\t\t\t\0打包项目",
        "build -s|--scheme <name>": "\0指定方案打包项目",
        "<name> ": "\t\t\t\0方案名及配置在为kaci.config.js中build下自定义"
    };
    for (let tip in helpInfo) {
        echo('tip',`${tip} \0\0 ${helpInfo[tip]}`)
    }
};
