const path = require("path");
const fs = require("fs-extra");

module.exports = {
    //批量创建目录
    mkdirs : function (dirArray){
        dirArray.forEach(function (name,i){
            fs.mkdirsSync(name)
            //console.log(__echo(`${symbols.flower}  init : ${path.join(process.cwd(),name)}`))
        })
    },
    //批量复制创建文件
    mkfiles : function (fileArray){
        fileArray.forEach(function (pair){
            let data = fs.readFileSync(pair[0],{ encoding: "utf-8" })
            fs.writeFileSync(pair[1], data)
            //console.log(__echo(`${symbols.flower}  init : ${pair[1]}`))
        })
    }
}




