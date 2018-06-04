const fs = require("fs");
const path = require("path");
const chalk = require('chalk');
//const exec = require('shelljs.exec')

const _symbols = require(path.join(__dirname,'const.js'));
let log = console.log
let _path = process.cwd();

module.exports = {
    init : function(config) {

        //dir
        let dirgroup = ['.kaci','src','dist']
        dirgroup.forEach(function (name,i){
            fs.mkdir(path.join(_path,name),function (){
                log(chalk.magentaBright(_symbols.flower + '  init : ' + path.join(_path,name)))
            })
        })
    
        //subdir
        let subdirgroup = ['css','js','template','data','img']
        subdirgroup.forEach(function (name,i){
            fs.mkdir(path.join(_path,'src',name),function (){
                log(chalk.magentaBright(_symbols.flower + '  init : ' + path.join(_path,'src',name)))
            })
        })

        //config
        fs.readFile(
            path.join(__dirname, "../sample/default/config.js"),
            { encoding: "utf-8" },
            function (err,data){
                fs.writeFile(path.join(_path, ".kaci", "config.js"), data,function (){
                    log(chalk.magentaBright(_symbols.flower + '  init : ' + path.join(_path,'.kaci/config.js')))
                });
                
            }
        );
    },
    init_gulp : function (){
        
        //gulpfile.js
        fs.readFile(
            path.join(__dirname, "../sample/default/gulpfile.js"),
            { encoding: "utf-8" },
            function(err, data) {
                fs.writeFile(path.join(_path, ".kaci", "gulpfile.js"), data,function (){
                    log(chalk.magentaBright(_symbols.flower + '  init : ' + path.join(_path,'.kaci/gulpfile.js')))
                });
            }
        );

        //package.json
        fs.readFile(
            path.join(__dirname, "../sample/default/gulp.json"),
            { encoding: "utf-8" },
            function(err, data) {
                fs.writeFile(path.join(_path,"package.json"), data,function (){
                    log(chalk.magentaBright(_symbols.flower + '  init : ' + path.join(_path,'package.json')))

                    //自动安装gulp相关基础依赖包
                    //var ist = exec('npm install')
                });
            }
        );

    },
    init_webpack : function (){
        console.log('webpack初始化')
    }

    //gulp -- csslab
}
