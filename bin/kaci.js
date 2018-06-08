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
//所有require进来模块 都可以用const定义。 
const _init = require('../lib/init.js');
const _start = require('../lib/start.js');
const _build = require('../lib/build.js');
const _help = require('../lib/help.js');

//本地函数
let __root = (file) => path.join(process.cwd(),file)
let __warn = chalk.redBright
let __tip = chalk.yellowBright
let __echo = chalk.cyanBright
let __help = chalk.magentaBright

const _conf = require(__root('kaci.config.js'));

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
    .action(function (argvs){
        if(argvs.gulp){
            _init.gulp()
            return
        }
        if(argvs.webpack){
            init.webpack()
            return
        }
        console.warn("非法参数")
    })

/*
或者使用下面这种写法更易扩展
cmd.command('init')
    .option('-t,--tool <value>', `指定初始化工具类型，可选:${mode.join(",")}`)
    .description('初始化项目')
    .action(function (argvs){
       if(!argvs.tool){
            return console.warn("请指定工具类型")
       }
       if(!_init[argvs.tool]){
            return console.log(`暂不支持工具类型${argvs.tool}`)
       }
       _init[argvs.tool]()
    })

*/

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
         //function(cmd) 和全局 cmd.command 易混淆建议修改命名
        let port = cmd.opts().port
        //读取kaci.config.js中模式启动对应服务
        try{
            //这里和init里面代码重复，提取到顶部
            //let conf = require(__root('kaci.config.js'));
            _start[_conf.mode](port)
        }catch(e){
            fail_tips()
        }
    })

//构建发布
cmd.command('build')
    .option('-m,--mode <mode>','指定build模式')
    .description('构建发布项目')
    .action(function (program){
        //let build_mode = cmd.opts().mode  //尽量把局部变量 cmd 和 全局变量 cmd 用不同的单词，以免混淆
       
         let build_mode = program.mode
        //读取kaci.config.js中模式构建应用
        try{
            //既然加载是确定的，应该把下面这一行移到文件头部
            //let conf = require(__root('kaci.config.js'));
           // _build[conf.mode](build_mode)
            _build[_conf.mode](build_mode)
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
