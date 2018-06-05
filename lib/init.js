const path = require("path");
const chalk = require("chalk");
const shell = require('shelljs');
const fs = require('fs');
const _fs = require(path.join(__dirname, "utils", "fs.js"));
const _symbols = require(path.join(__dirname, "include", "symbols.js"));
let _path = process.cwd();

module.exports = {
    //创建默认文件夹及配置文件
    init: function(config) {
        _fs.mkdirs("init : ", [
            "src",
            "dist",
            "src/css",
            "src/js",
            "src/template",
            "src/data",
            "src/img",
            "src/temp"
        ]);
        let commonfiles = [
            [path.join(__dirname, "../sample/common/.gitignore"),path.join(_path, ".gitignore")],
            [path.join(__dirname, "../sample/common/config.js"),path.join(_path,"config.js")]
        ]
        commonfiles.forEach(function (pair){
            _fs.mkfile(
                "init : ",
                pair[0],
                pair[1]
            );
        })
    },
    //模式分组，可扩展，默认以第一个模式作为无参数时的初始化方案
    mode: ["gulp", "webpack"],
    //gulp
    gulp: function() {
        let gulpfiles = [
            [path.join(__dirname, "../sample/gulp/gulpfile.js"),path.join(_path, "gulpfile.js")]
        ]
        gulpfiles.forEach(function (pair){
            _fs.mkfile(
                "init : ",
                pair[0],
                pair[1]
            );
        })

        //同步创建package.json文件
        let package = fs.readFileSync(path.join(__dirname, "../sample/gulp/package.json"),{encoding:'utf-8'})
        fs.writeFileSync(path.join(_path, "package.json"),package)

        //自动安装Package包， 如果已经安装cnpm则用cnpm安装
        console.log(chalk.magentaBright(_symbols.flower + '  ' + "init : " + path.join(_path,"package.json")))
        console.log(chalk.yellowBright(_symbols.flower + '  ' + "install : " + 'Start installing the dependency package..'))
        !!shell.which('cnpm') ? shell.exec('cnpm install') : shell.exec('npm install')
        
    },
    //webpack
    webpack: function() {
        console.log("webpack初始化-->to be continued");
    }
};
