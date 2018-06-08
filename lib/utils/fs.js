const path = require("path");
const fs = require("fs");

module.exports = {
    //批量创建目录
    mkdirs : function (dirArray){
        dirArray.forEach(function (name,i){
            fs.mkdir(name,function (){
                //console.log(__echo(`${symbols.flower}  init : ${path.join(process.cwd(),name)}`))
            })
        })
    },
    //创建文件
    mkfiles : function (fileArray){
        fileArray.forEach(function (pair){
            fs.readFile(
                pair[0],
                { encoding: "utf-8" },
                function (err,data){
                    fs.writeFile(pair[1], data,function (){
                        //console.log(__echo(`${symbols.flower}  init : ${pair[1]}`))
                    });
                }
            );
        })
    }
}




