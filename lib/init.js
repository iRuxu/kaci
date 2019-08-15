const path = require("path");
const shell = require('shelljs');
const echo = require("./utils/echo");
const fs = require("fs");
const _fs = require("./utils/fs.js");

let sampleFileSrc = (filename) => path.join(__dirname, "../sample/",filename)
let rootFileDist = (filename) => path.join(process.cwd(),filename)

module.exports = {

    gulp: function() {
        //批量创建目录
        _fs.mkdirs([
            "src",
            "src/css",
            "src/css/module",
            "src/css/include",
            "src/js",
            "src/js/module",
            "src/js/widget",
            "src/js/plugin",
            "src/js/lib",
            "src/html",
            "src/html/module",
            "src/data",
            "src/data/temp",
            "src/img",
            "src/img/temp",
            "src/temp"
        ]);
        //批量创建文件
        let filesMap = [
            [sampleFileSrc('gitignore'),rootFileDist(".gitignore")],
            [sampleFileSrc('.babelrc'),rootFileDist(".babelrc")],
            [sampleFileSrc('demo.hbs'),rootFileDist("src/html/index.hbs")],
            [sampleFileSrc('demo.js'),rootFileDist("src/js/index.js")],
            [sampleFileSrc('gulpfile.js'),rootFileDist("gulpfile.js")],
            [sampleFileSrc('kaci.config.js'),rootFileDist("kaci.config.js")],
            [sampleFileSrc('webpack.config.js'),rootFileDist("webpack.config.js")]
        ]
        filesMap.forEach(function (pair){
            _fs.mkfiles(pair)().catch(function (e){
                console.log(e)
            })
        })
        //复制依赖表文件
        fs.copyFile(sampleFileSrc('package.json'),rootFileDist("package.json"),function (err){
            //安装gulp与依赖
            echo('tip',`install : 检查与安装依赖包..`)
            !shell.which('gulp') && shell.exec('npm install -g gulp')
            !!shell.which('cnpm') ? shell.exec('cnpm install') : shell.exec('npm install')

            //初始化完成
            echo('tip',`install : 请自定义kaci.config.js文件`)
            echo('ok',`success : 初始化成功`)
        })
    }

};
