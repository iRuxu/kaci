#!/usr/bin/env node

//依赖模块
const path = require("path");
const cmd = require('commander');

//配置模块
const info = require('../package.json');
const tool = require("../lib/include/tool");
const setting = require('../lib/include/setting');

//方法模块
const echo = require('../lib/utils/echo.js');
const _init = require('../lib/init.js');
const _start = require('../lib/start.js');
const _build = require('../lib/build.js');
const _help = require('../lib/help.js');

//本地函数
let get_localconf = () =>  require(path.join(process.cwd(),'kaci.config.js'))

//欢迎信息
echo('hi',`${info.name.toUpperCase()}`,`ver ${info.version}`)
echo('hi',`${__dirname}`)

//初始化命令
cmd.command('init')
    .option('-t,--tool <name>','初始化项目')
    .description('初始化项目')
    .action(function (argvs){
        echo('tip',`init : 初始化项目..`)
        if(!argvs.tool){
            _init[setting.tool]()
        }else{
            _init[argvs.tool]()
        }
    })

//启动服务
cmd.command('start')
    .option('-p,--port <n>','启动本地服务')
    .description('启动本地服务')
    .action(function (argvs){
        echo('tip',`start : 启动本地服务..`)
        let port = argvs.port || setting.port
        try{
            let conf = get_localconf()
            _start[conf.tool](port)
        }catch(e){
            echo('error','未找到kaci.config.js配置文件,请使用kaci init初始化')
        }
    })

//构建发布
cmd.command('build')
    .option('-s,--scheme <name>','打包项目')
    .description('打包项目')
    .action(function (argvs){
        echo('tip',`build : 开始打包项目..`)
        let scheme = argvs.scheme || setting.scheme
        try{
            let conf = get_localconf()
            _build[conf.tool](scheme)
        }catch(e){
            echo('error','未找到kaci.config.js配置文件,请使用kaci init初始化')
        }
    })

//帮助命令
cmd.command('help')
    .description('查看命令行帮助')
    .action(function (){
        _help();
    })
if(process.argv.length<=2){
    _help();
}

//解析命令
cmd.parse(process.argv)
