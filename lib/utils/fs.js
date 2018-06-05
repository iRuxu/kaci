const path = require("path");
const chalk = require("chalk");
const fs = require("fs");
const _symbols = require(path.join(__dirname, "..","include", "symbols.js"));
let _path = process.cwd();

module.exports = {
    //批量创建目录
    mkdirs : function (tips,dirArray){
        dirArray.forEach(function (name,i){
            fs.mkdir(path.join(_path,name),function (){
                console.log(chalk.magentaBright(_symbols.flower + '  ' + tips + path.join(_path,name)))
            })
        })
    },
    //根据示例文件创建文件
    mkfile : function (tips,fr,to){
        fs.readFile(
            fr,
            { encoding: "utf-8" },
            function (err,data){
                fs.writeFile(to, data,function (){
                    console.log(chalk.magentaBright(_symbols.flower + '  ' + tips + to))
                });
            }
        );
    }
}




