const path = require("path");
const fs = require("fs-extra");

//批量创建目录
function mkdirs(dirArray){
    dirArray.forEach(function (name,i){
        fs.mkdirsSync(name)
    })
}

//批量复制创建文件
const readFile = function (filepath){
    return new Promise((resolve,reject)=>{
        fs.readFile(filepath,{ encoding: "utf-8" },function (err,data){
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}
const writeFile = function (filepath,data){
    return new Promise((resolve,reject)=>{
        fs.writeFile(filepath,data,function (err){
            if(err){
                reject(error)
            }
            resolve(data)
        })
    })
}
function mkfiles(filePair){
    return async function (){
        let content = await readFile(filePair[0])
        await writeFile(filePair[1],content)
    }
}

module.exports = {
    mkdirs,mkfiles
}



