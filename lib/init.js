const path = require("path");
const fs = require('fs');
const shell = require('shelljs');
const echo = require("./utils/echo");

const _fs = require("./utils/fs.js");
let gulpFileSrc = (filename) => path.join(__dirname, "../sample/gulp/",filename)
let gulpFileDist = (filename) => path.join(process.cwd(),filename)

module.exports = {

    gulp: function() {
        //批量创建目录
        _fs.mkdirs([
            "src",
            "src/css",
            "src/css/module",
            "src/js",
            "src/js/module",
            "src/template",
            "src/template/module",
            "src/data",
            "src/data/temp",
            "src/data/_bak",
            "src/img",
            "src/img/temp",
            "src/img/psd",
            "src/temp",
            "dist",
        ]);
        //批量创建文件
        _fs.mkfiles([
            [gulpFileSrc('.gitignore'),gulpFileDist(".gitignore")],
            [gulpFileSrc('gulpfile.js'),gulpFileDist("gulpfile.js")],
            [gulpFileSrc('kaci.config.js'),gulpFileDist("kaci.config.js")],
            [gulpFileSrc('demo.hbs'),gulpFileDist("src/template/index.hbs")],
        ])
        //创建package.json文件
        //尽量编译使用多重回调，代码可读性不强。使用同步函数 readFileSync或者 使用async 包的waterfall函数
        //或者使用Promise进行改造
        /**
        const readFile = (filepath)=>{
            return new Promise((resovle, reject)=>{
                 fs.readFile(filepath,{encoding:'utf-8'},function (err,data){
                    if(err){
                        return reject(err)
                    }
                    reslove(data)
                 })
            
            }) 
        }
        const writeFile = (filepath, data)=>{
            return new Promise((resovle, reject)=>{
                fs.writeFile(filepath, data, function (err){
                if(err){
                    return reject(err)
                }
                return resolve()
            })
        }
        try{
            let content = await readFile(gulpFileSrc("package.json"));
            await writeFile(gulpFileSrc("package.json"), content)
        }catch(e){
            dosomething
        }
        console.log(__echo(`${symbols.flower}  init : ${gulpFileDist("package.json")}`))
        //自动安装Package包， 如果已经安装cnpm则用cnpm安装
        console.log(__tip(`${symbols.flower}  install : Start installing the dependency package..`))
        !!shell.which('cnpm') ? shell.exec('cnpm install') : shell.exec('npm install')
        */
        fs.readFile(gulpFileSrc("package.json"),{encoding:'utf-8'},function (err,data){
            fs.writeFile(gulpFileDist("package.json"),data,function (err){
                //TODO:promise
                echo('ok',`success : 初始化成功`)
                //echo(`init : ${gulpFileDist("package.json")}`)
                //自动安装Package包， 如果已经安装cnpm则用cnpm安装
                //echo('tip',`install : Start installing the dependency package..`)
                //!!shell.which('cnpm') ? shell.exec('cnpm install') : shell.exec('npm install')
            })
        })
    }

};
