#!/usr/bin/env node

//依赖模块
const cmd = require('commander');

//配置模块
const info = require('../package.json');
const setting = require('../lib/include/setting');

//方法模块
const echo = require('../lib/utils/echo.js');
const _init = require('../lib/init.js');


//欢迎信息
echo('hi',`${info.name.toUpperCase()}`,`ver ${info.version}`)
echo('hi',`${__dirname}`)

//初始化命令
cmd.command('gulp')
    //.option('-t,--tool <name>','初始化项目')
    .description('初始化项目')
    .action(function (argvs){
        echo('tip',`init : [Gulp]初始化项目..`)
        _init[setting.tool]()
    })


//解析命令
cmd.parse(process.argv)
