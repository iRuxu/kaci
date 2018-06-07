#!/usr/bin/env node

//依赖模块
const path = require("path");
const fs = require("fs");
const chalk = require('chalk');
const cmd = require('commander');

//配置模块
const mode = require("../lib/include/mode.js");
const symbols = require('../lib/include/symbols.js');
const kaciconf = require('../package.json');

//方法模块
let _init = require('../lib/init.js');
let _start = require('../lib/start.js');
let _build = require('../lib/build.js');
let _help = require('../lib/help.js');

//本地函数
let __root = (file) => path.join(process.cwd(),file)
let __warn = chalk.redBright
let __tip = chalk.yellowBright
let __echo = chalk.cyanBright
let __help = chalk.magentaBright

//欢迎信息
console.log(
    __echo(
        symbols.plane +
            " ------------------------------------------------------" +
            symbols.arrow
    )
);
console.log(
    __echo(`${symbols.kaci}\0\0${kaciconf.name.toUpperCase()}`),
    `ver ${kaciconf.version}`
);
console.log(__tip(`${symbols.flower}\0\0${__dirname}`));
console.log(
    __echo(
        symbols.plane +
            " ------------------------------------------------------" +
            symbols.heart
    )
);

//初始化命令
cmd.command('init')
    .option('-g,--gulp','初始化gulp前端项目')
    .option('-w,--webpack','初始化webpack前端项目')
    .description('初始化项目')
    .action(function (cmd){
        if(process.argv.length<=3){
            _init[mode[0]]()
        }else{
            for(let i=0,len=mode.length;i<len;i++){
                if(!cmd.opts()[mode[i]]) continue
                _init[mode[i]]()
            }
        }
    })

let fail_tips = function (){
    console.log(
        __warn(`${symbols.fail} Error: 未找到 <`),
        __tip('kaci.config.js'),
        __warn('> 配置文件, 请使用 ['),
        __tip('kaci init'),
        __warn('] 命令初始化一个配置文件, 更多初始化模式请使用 ['),
        __tip('kaci help'),
        __warn('] 命令查看')
    )
}
     
//启动服务
cmd.command('start')
    .option('-p,--port <n>','指定本地服务端口')
    .description('启动本地服务')
    .action(function (cmd){
        let port = cmd.opts().port
        //读取kaci.config.js中模式启动对应服务
        try{
            let conf = require(__root('kaci.config.js'));
            _start[conf.mode](port)
        }catch(e){
            fail_tips()
        }
    })

//构建发布
cmd.command('build')
    .option('-m,--mode <mode>','指定build模式')
    .description('构建发布项目')
    .action(function (cmd){
        let build_mode = cmd.opts().mode
        //读取kaci.config.js中模式构建应用
        try{
            let conf = require(__root('kaci.config.js'));
            _build[conf.mode](build_mode)
        }catch(e){
            fail_tips()
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
