const path = require("path");
const chalk = require("chalk");
const shell = require('shelljs');
const fs = require('fs');
const symbols = require("./include/symbols.js");

const _fs = require("./utils/fs.js");
let gulpFileSrc = (filename) => path.join(__dirname, "../sample/gulp/",filename)
let gulpFileDist = (filename) => path.join(process.cwd(),filename)

let __warn = chalk.redBright
let __tip = chalk.yellowBright
let __echo = chalk.cyanBright
let __ok = chalk.greenBright

module.exports = {

    //gulp模式
    gulp: function() {
        //批量创建目录
        _fs.mkdirs([
            "src",
            "dist",
            "src/css",
            "src/js",
            "src/template",
            "src/data",
            "src/img",
            "src/temp"
        ]);
        //批量创建文件
        _fs.mkfiles([
            [gulpFileSrc('.gitignore'),gulpFileDist(".gitignore")],
            [gulpFileSrc('gulpfile.js'),gulpFileDist("gulpfile.js")],
            [gulpFileSrc('kaci.config.js'),gulpFileDist("kaci.config.js")]
        ])
        //创建package.json文件
        fs.readFile(gulpFileSrc("package.json"),{encoding:'utf-8'},function (err,data){
            fs.writeFile(gulpFileDist("package.json"),data,function (err){
                console.log(__echo(`${symbols.flower}  init : ${gulpFileDist("package.json")}`))
                //自动安装Package包， 如果已经安装cnpm则用cnpm安装
                console.log(__tip(`${symbols.flower}  install : Start installing the dependency package..`))
                !!shell.which('cnpm') ? shell.exec('cnpm install') : shell.exec('npm install')
            })
        })
        //TODO:promise
        console.log(__ok(`${symbols.success}\0\0success : 初始化成功`))
    },

    //webpack
    webpack: function() {
        console.log("webpack初始化-->to be continued");
    }
};
