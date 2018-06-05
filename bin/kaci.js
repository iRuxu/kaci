#!/usr/bin/env node

//依赖模块
const path = require("path");
const chalk = require('chalk');
const cmd = require('commander');

//本地模块
const _symbols = require('../lib/include/symbols.js');
let _init = require('../lib/init.js');
let _start = require('../lib/start.js');
let _help = require('../lib/help.js');

//常量定义
const _name = require(path.join(__dirname, "../package.json")).name;
const _version = require(path.join(__dirname, "../package.json")).version;

//欢迎信息
console.log(
    chalk.cyanBright(
        _symbols.plane +
            " ------------------------------------------------------" +
            _symbols.arrow
    )
);
console.log(chalk.cyanBright(_symbols.kaci + "  " + _name.toUpperCase()), "ver " + _version);
console.log(chalk.gray(__dirname));

//初始化命令
cmd.command('init')
    .option('-g,--gulp','初始化gulp项目')
    .option('-w,--webpack','初始化webpack项目')
    .action(function (cmd){

        _init.init()

        let initMode = _init.mode
        if(process.argv.length<=3){
            _init[initMode[0]]()
        }else{
            for(var i=0,len=initMode.length;i<len;i++){
                if(!cmd.opts()[initMode[i]]) continue
                _init[initMode[i]]()
            }
        }

        //TODO:promise
        console.log(chalk.greenBright(_symbols.success + '  success : 初始化成功'))
    })
     
//启动服务
cmd.command('start')
    .option('-p, --port <n>','启动本地服务')
    .description('启动本地服务')
    .action(function (cmd){
        let port = cmd.opts().port || '512'
        _start(port);
    })

//构建发布
/* cmd.command('build')
    .option('-o, --local','发布本地版本')
    .option('-t, --preview','发布测试版本')
    .option('-e, --production','发布线上版本')
    .description('打包发布项目')
    .action(function (){
        
    }) */

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

//尾分割线
console.log(
    chalk.cyanBright(
        _symbols.plane +
            " ------------------------------------------------------" +
            _symbols.heart
    )
);