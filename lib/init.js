const path = require("path");
const shell = require('shelljs');
const echo = require("./utils/echo");
const fs = require('fs-extra')

let target = path.join(process.cwd())

module.exports = {

    gulp: function() {

        //复制demo文件
        let sample = path.join(__dirname, "../sample/gulp")
        fs.copy(sample,target)
            .then(function (){
                
                //安装gulp与依赖
                echo('tip',`install : 检查与安装依赖包..`)
                !shell.which('gulp') && shell.exec('npm install -g gulp')
                !!shell.which('cnpm') ? shell.exec('cnpm install') : shell.exec('npm install')

                //初始化完成
                echo('tip',`install : 请自定义kaci.config.js文件`)
                echo('ok',`success : 初始化成功`)
            })
            .catch(err => console.error(err))

    }

};
